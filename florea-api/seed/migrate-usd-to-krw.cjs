// One-time move of the stored prices from US dollars to Korean won.
//
//   node seed/migrate-usd-to-krw.cjs --env .env                    dry run on the dev database: prints what would change
//   node seed/migrate-usd-to-krw.cjs --env .env --apply --backup krw-backup.json
//   node seed/migrate-usd-to-krw.cjs --env .env --restore krw-backup.json
//
// What it changes:
//   - products: productPrice in dollars becomes won: price × 1,350, rounded to the nearest 1,000, at least 1,000
//   - orders and their items, so that the order history matches: item prices the same way, the delivery fee by the
//     won rule (4,000, free from 50,000), the total again
//   - notices and FAQ entries: "$5" becomes "₩4,000" and "$100" becomes "₩50,000"; any other dollar amount is
//     only reported
// A price of 1,000 or more is already in won and is left alone, so a second run changes nothing.
//
// The database is the one the API uses: MONGO_PROD when NODE_ENV is production, MONGO_DEV otherwise. --env reads
// those settings from a file; inside the API container they are already set. Nothing of them is printed.
// --apply needs --backup: the values before the change are written there first, and --restore puts them back.
const fs = require('fs');
const path = require('path');

const RATE = 1350;
const DELIVERY_FEE = 4000;
const FREE_DELIVERY_FROM = 50000;
const TEXT_AMOUNTS = { 5: '₩4,000', 100: '₩50,000' };

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => (args.indexOf(name) >= 0 ? args[args.indexOf(name) + 1] : undefined);

// --env: KEY=VALUE lines, without printing them
const envFile = value('--env');
if (envFile) {
	for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
		const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
		if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
	}
}
const production = process.env.NODE_ENV === 'production';
const uri = production ? process.env.MONGO_PROD : process.env.MONGO_DEV;
if (!uri) {
	console.error(`No ${production ? 'MONGO_PROD' : 'MONGO_DEV'} setting. Pass --env <file> or run it where the API runs.`);
	process.exit(1);
}
// mongoose of the API: next to this file on the dev machine, in /app inside the container
const mongoose = require(require.resolve('mongoose', { paths: [path.join(__dirname, '..'), process.cwd()] }));

const toWon = (usd) => Math.max(1000, Math.round((usd * RATE) / 1000) * 1000);
const won = (n) => '₩' + n.toLocaleString('en-US');
const inDollars = (price) => typeof price === 'number' && price < 1000;

const main = async () => {
	await mongoose.connect(uri);
	const db = mongoose.connection.db;
	const names = (await db.listCollections().toArray()).map((c) => c.name);
	const pick = (...candidates) => candidates.find((name) => names.includes(name));
	const C = {
		products: pick('products'),
		orders: pick('orders'),
		items: pick('orderitems', 'orderItems'),
		notices: pick('notices'),
	};
	console.log(`database: ${db.databaseName} (${production ? 'production' : 'development'}); collections: ${JSON.stringify(C)}`);

	if (flag('--restore')) {
		const backup = JSON.parse(fs.readFileSync(value('--restore'), 'utf8'));
		for (const [key, rows] of Object.entries(backup.collections)) {
			for (const row of rows) {
				const { _id, ...fields } = row;
				await db.collection(C[key]).updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { $set: fields });
			}
			console.log(`restored ${rows.length} ${key}`);
		}
		return;
	}

	const apply = flag('--apply');
	if (apply && !value('--backup')) {
		console.error('--apply needs --backup <file>.');
		process.exit(1);
	}
	const backup = { createdAt: new Date().toISOString(), database: db.databaseName, collections: { products: [], orders: [], items: [], notices: [] } };
	const writes = { products: [], orders: [], items: [], notices: [] };

	// products
	const products = await db.collection(C.products).find({}, { projection: { productTitle: 1, productPrice: 1 } }).toArray();
	let skipped = 0;
	for (const p of products) {
		if (!inDollars(p.productPrice)) {
			skipped++;
			continue;
		}
		const next = toWon(p.productPrice);
		console.log(`product  ${p.productTitle}: $${p.productPrice} -> ${won(next)}`);
		backup.collections.products.push({ _id: String(p._id), productPrice: p.productPrice });
		writes.products.push({ updateOne: { filter: { _id: p._id }, update: { $set: { productPrice: next } } } });
	}
	console.log(`products: ${writes.products.length} to change, ${skipped} already in won`);

	// orders and their items
	const orders = C.orders ? await db.collection(C.orders).find({}).toArray() : [];
	let ordersSkipped = 0;
	for (const order of orders) {
		const items = C.items ? await db.collection(C.items).find({ orderId: order._id }).toArray() : [];
		if (!items.length || !items.every((item) => inDollars(item.itemPrice))) {
			ordersSkipped++;
			continue;
		}
		let subtotal = 0;
		for (const item of items) {
			const next = toWon(item.itemPrice);
			subtotal += next * item.itemQuantity;
			backup.collections.items.push({ _id: String(item._id), itemPrice: item.itemPrice });
			writes.items.push({ updateOne: { filter: { _id: item._id }, update: { $set: { itemPrice: next } } } });
		}
		const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
		console.log(`order    ${String(order._id).slice(-6).toUpperCase()} (${order.orderStatus}): $${order.orderTotal} incl. $${order.orderDelivery} delivery -> ${won(subtotal + delivery)} incl. ${won(delivery)}`);
		backup.collections.orders.push({ _id: String(order._id), orderTotal: order.orderTotal, orderDelivery: order.orderDelivery });
		writes.orders.push({ updateOne: { filter: { _id: order._id }, update: { $set: { orderTotal: subtotal + delivery, orderDelivery: delivery } } } });
	}
	console.log(`orders: ${writes.orders.length} to change, ${ordersSkipped} already in won or without items`);

	// notices and FAQ entries
	const notices = C.notices ? await db.collection(C.notices).find({ $or: [{ noticeTitle: /\$\d/ }, { noticeContent: /\$\d/ }] }).toArray() : [];
	for (const notice of notices) {
		const change = (text) => (text ?? '').replace(/\$(\d+)\b/g, (whole, amount) => TEXT_AMOUNTS[amount] ?? whole);
		const title = change(notice.noticeTitle);
		const content = change(notice.noticeContent);
		const left = `${title} ${content}`.match(/\$\d+/g);
		if (left) console.log(`notice   "${notice.noticeTitle}": other dollar amounts left as they are: ${left.join(', ')}`);
		if (title === notice.noticeTitle && content === notice.noticeContent) continue;
		console.log(`notice   "${notice.noticeTitle}" -> "${title}"`);
		if (content !== notice.noticeContent) console.log(`         ${content}`);
		backup.collections.notices.push({ _id: String(notice._id), noticeTitle: notice.noticeTitle, noticeContent: notice.noticeContent });
		writes.notices.push({ updateOne: { filter: { _id: notice._id }, update: { $set: { noticeTitle: title, noticeContent: content } } } });
	}
	console.log(`notices: ${writes.notices.length} to change`);

	if (!apply) {
		console.log('\nDry run: nothing was changed. Run again with --apply --backup <file> to change it.');
		return;
	}
	fs.writeFileSync(value('--backup'), JSON.stringify(backup, null, 1));
	console.log(`\nbackup written: ${value('--backup')}`);
	for (const key of Object.keys(writes)) {
		if (writes[key].length) {
			const result = await db.collection(C[key]).bulkWrite(writes[key]);
			console.log(`${key}: ${result.modifiedCount} changed`);
		}
	}
};

main()
	.catch((err) => {
		console.error('failed:', err.message);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());

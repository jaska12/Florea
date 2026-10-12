// Fills an empty shop: the florists and products in seed/demo-shop.json are created through the API,
// with the photos in seed/demo-shop/. These are sample shops, not real businesses.
// It can be run again: a florist that exists is logged in, not signed up; a profile that has a photo
// and a product whose title the florist already has are left alone.
//
//   node seed/seed-demo-shop.mjs <graphql url> <password for the florist accounts>
//   node seed/seed-demo-shop.mjs http://localhost:3007/graphql mypassword
//
// The password (5 to 12 characters) is set on every florist account this run signs up.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , api, password] = process.argv;
if (!api || !password || password.length < 5 || password.length > 12) {
	console.error('usage: node seed/seed-demo-shop.mjs <graphql url> <password for the florist accounts, 5 to 12 characters>');
	process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const photoDir = path.join(here, 'demo-shop');
const { florists } = JSON.parse(fs.readFileSync(path.join(here, 'demo-shop.json'), 'utf8'));

// every photo has to be there before anything is written
for (const file of florists.flatMap((f) => [f.image, ...f.products.map((p) => p.image)])) {
	if (!fs.existsSync(path.join(photoDir, file))) {
		console.error(`missing photo: seed/demo-shop/${file}`);
		process.exit(1);
	}
}

const gql = async (query, variables, token) => {
	const res = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
		body: JSON.stringify({ query, variables }),
	});
	const json = await res.json();
	if (json.errors) throw new Error(json.errors[0].message);
	return json.data;
};

/** sends one photo the way the site does and returns the address the API stored it under **/
const upload = async (file, target, token) => {
	const form = new FormData();
	form.append(
		'operations',
		JSON.stringify({
			query: `mutation($file: Upload!, $target: String!){ imageUploader(file: $file, target: $target) }`,
			variables: { file: null, target },
		}),
	);
	form.append('map', JSON.stringify({ 0: ['variables.file'] }));
	form.append('0', new Blob([fs.readFileSync(path.join(photoDir, file))], { type: 'image/jpeg' }), file);
	const res = await fetch(api, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'apollo-require-preflight': 'true' },
		body: form,
	});
	const json = await res.json();
	if (json.errors) throw new Error(json.errors[0].message);
	return json.data.imageUploader;
};

const MEMBER = `_id memberNick memberType memberFullName memberImage memberAddress memberDesc accessToken`;
const count = { signedUp: 0, profiles: 0, products: 0, productsThere: 0 };

for (const florist of florists) {
	// the account
	let member;
	try {
		member = (
			await gql(`mutation($input: LoginInput!){ login(input: $input){ ${MEMBER} } }`, {
				input: { memberNick: florist.memberNick, memberPassword: password },
			})
		).login;
	} catch (err) {
		if (!/No member with that member nick/.test(err.message)) {
			throw new Error(`${florist.memberNick}: ${err.message} (the account exists with another password?)`);
		}
		member = (
			await gql(`mutation($input: MemberInput!){ signup(input: $input){ ${MEMBER} } }`, {
				input: {
					memberNick: florist.memberNick,
					memberPassword: password,
					memberPhone: florist.memberPhone,
					memberType: 'AGENT',
				},
			})
		).signup;
		count.signedUp++;
	}
	if (member.memberType !== 'AGENT') throw new Error(`${florist.memberNick} exists and is not a florist account`);
	const token = member.accessToken;

	// the profile: only what is still empty, so that later edits on the site are kept
	const profile = {};
	if (!member.memberFullName) profile.memberFullName = florist.memberFullName;
	if (!member.memberAddress) profile.memberAddress = florist.memberAddress;
	if (!member.memberDesc) profile.memberDesc = florist.memberDesc;
	if (!member.memberImage) profile.memberImage = await upload(florist.image, 'member', token);
	if (Object.keys(profile).length > 0) {
		await gql(
			`mutation($input: MemberUpdate!){ updateMember(input: $input){ _id } }`,
			{ input: { _id: member._id, ...profile } },
			token,
		);
		count.profiles++;
	}

	// the products
	const { getAgentProducts } = await gql(
		`query($input: AgentProductsInquiry!){ getAgentProducts(input: $input){ list { productTitle } } }`,
		{ input: { page: 1, limit: 200, search: {} } },
		token,
	);
	const existing = new Set(getAgentProducts.list.map((product) => product.productTitle.toLowerCase()));
	for (const product of florist.products) {
		if (existing.has(product.productTitle.toLowerCase())) {
			count.productsThere++;
			continue;
		}
		const { image, ...fields } = product;
		const photo = await upload(image, 'product', token);
		await gql(
			`mutation($input: ProductInput!){ createProduct(input: $input){ _id } }`,
			{
				input: {
					...fields,
					productLocation: florist.productLocation,
					productAddress: florist.memberAddress,
					productImages: [photo],
				},
			},
			token,
		);
		count.products++;
	}
	console.log(`${florist.memberNick}: ok`);
}

console.log(
	`florists signed up: ${count.signedUp}, profiles filled: ${count.profiles}, products created: ${count.products}, products already there: ${count.productsThere}`,
);

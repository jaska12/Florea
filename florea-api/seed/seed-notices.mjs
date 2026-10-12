// Fills the customer-care page: the notices and the FAQ in seed/notices.json are created through the API.
// It can be run again: an entry whose category and title already exist is left alone.
//
//   node seed/seed-notices.mjs <graphql url> <admin nick> <admin password>
//   node seed/seed-notices.mjs http://localhost:3007/graphql myadmin mypassword
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , api, nick, password] = process.argv;
if (!api || !nick || !password) {
	console.error('usage: node seed/seed-notices.mjs <graphql url> <admin nick> <admin password>');
	process.exit(1);
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

const { login } = await gql(`mutation($input: LoginInput!){ login(input: $input){ accessToken memberType } }`, {
	input: { memberNick: nick, memberPassword: password },
});
if (login.memberType !== 'ADMIN') throw new Error(`${nick} is not an admin`);

const entries = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'notices.json'), 'utf8'));
const { getAllNoticesByAdmin } = await gql(
	`query($input: AllNoticesInquiry!){ getAllNoticesByAdmin(input: $input){ list { noticeCategory noticeTitle } } }`,
	{ input: { page: 1, limit: 1000, search: {} } },
	login.accessToken,
);
const existing = new Set(getAllNoticesByAdmin.list.map((notice) => `${notice.noticeCategory}|${notice.noticeTitle}`));

// The page lists notices newest first and the FAQ oldest first, so notices are created from the last one up:
// both then appear in the order of the file.
const ordered = [
	...entries.filter((entry) => entry.noticeCategory === 'NOTICE').reverse(),
	...entries.filter((entry) => entry.noticeCategory !== 'NOTICE'),
];

let created = 0;
for (const entry of ordered) {
	if (existing.has(`${entry.noticeCategory}|${entry.noticeTitle}`)) continue;
	await gql(
		`mutation($input: NoticeInput!){ createNoticeByAdmin(input: $input){ _id } }`,
		{ input: { ...entry, noticeStatus: 'ACTIVE' } },
		login.accessToken,
	);
	created++;
}
console.log(`${created} created, ${ordered.length - created} already there`);

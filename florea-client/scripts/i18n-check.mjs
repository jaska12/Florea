// yarn i18n:check
// Compares the code with the locale files (public/locales/<language>/<namespace>.json) and reports:
//   - keys the code asks for that English does not have (missing)
//   - keys English has that Korean or Russian do not, and plural forms a language needs and lacks
//   - keys no code asks for (unused)
//   - pages that do not load a namespace one of their components reads
// It ends with exit code 1 when anything is missing; unused keys are listed and do not fail it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANGUAGES = ['en', 'kr', 'ru'];
const DEFAULT_NS = 'common';
/** loaded on every page by libs/i18n/server.ts **/
const SHARED_NS = ['common', 'ai'];
/** the plural forms each language uses (the suffixes of i18next) **/
const PLURALS = { en: ['one', 'other'], kr: ['other'], ru: ['one', 'few', 'many', 'other'] };
const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

/* ---------- the locale files ---------- */
const flatten = (obj, prefix = '') =>
	Object.entries(obj).flatMap(([key, value]) =>
		value && typeof value === 'object' ? flatten(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]],
	);
const namespaces = fs
	.readdirSync(path.join(root, 'public/locales/en'))
	.filter((file) => file.endsWith('.json'))
	.map((file) => file.replace('.json', ''));
const texts = {}; // language -> "ns:key" -> text
for (const language of LANGUAGES) {
	texts[language] = new Map();
	for (const ns of namespaces) {
		const file = path.join(root, 'public/locales', language, `${ns}.json`);
		if (!fs.existsSync(file)) continue;
		for (const [key, value] of flatten(JSON.parse(fs.readFileSync(file, 'utf8')))) texts[language].set(`${ns}:${key}`, value);
	}
}
/** "order:cart.itemsCount_one" -> "order:cart.itemsCount" **/
const base = (key) => key.replace(PLURAL_SUFFIX, '');
const bases = (language) => new Set([...texts[language].keys()].map(base));
const english = bases('en');

/* ---------- the code ---------- */
const walk = (dir) =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(full);
		return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
	});
const sources = ['pages', 'libs', 'apollo'].flatMap((dir) => walk(path.join(root, dir)));
const rel = (file) => path.relative(root, file).replace(/\\/g, '/');

const used = new Set(); // exact "ns:key"
const prefixes = new Set(); // "ns:prefix." of keys built at run time
const asked = []; // { file, key } of literal keys, to report the missing ones
const fileNamespaces = new Map(); // file -> namespaces it reads
const imports = new Map(); // file -> files it imports

const qualify = (key, ns) => (key.includes(':') ? key : `${ns}:${key}`);

for (const file of sources) {
	const src = fs.readFileSync(file, 'utf8');
	const hooks = [...src.matchAll(/useTranslation\(\s*['"]([\w-]+)['"]/g)].map((m) => m[1]);
	const ns = hooks[0] ?? DEFAULT_NS;
	const reads = new Set(hooks);

	// t('key'), tr('ns:key', …), i18nKey={'key'}
	for (const m of src.matchAll(/(?:\bt|\btr|i18n\.t)\(\s*(['"])((?:(?!\1).)+)\1|i18nKey=\{?\s*(['"])((?:(?!\3).)+)\3/g)) {
		const key = qualify(m[2] ?? m[4], ns);
		used.add(key);
		asked.push({ file: rel(file), key });
		reads.add(key.split(':')[0]);
	}
	// t(`prefix.${value}`) and tr(`ns:prefix.${value}`, …): every key under the prefix counts as used
	for (const m of src.matchAll(/(?:\bt|\btr|i18n\.t)\(\s*`([^`$]*)\$\{|i18nKey=\{\s*`([^`$]*)\$\{/g)) {
		const prefix = qualify(m[1] ?? m[2], ns);
		prefixes.add(prefix);
		reads.add(prefix.split(':')[0]);
	}
	// enumLabel('productType', value) reads common:enum.productType.<value>
	for (const m of src.matchAll(/enumLabel\(\s*['"](\w+)['"]/g)) prefixes.add(`common:enum.${m[1]}.`);
	if (/useEnumLabel\(/.test(src)) reads.add('common');
	if (/enumLabel\(\s*[A-Z_]+\[/.test(src)) prefixes.add('common:enum.'); // the group is chosen at run time
	// a constant that holds a key (label: 'shopBy.tab.occasion') is read later with t(constant)
	for (const m of src.matchAll(/(['"])([\w-]+:)?([A-Za-z][\w-]*(?:\.[\w-]+)+)\1/g)) {
		const key = qualify(`${m[2] ?? ''}${m[3]}`, ns);
		if (english.has(key)) used.add(key);
	}

	if (reads.size > 0) fileNamespaces.set(file, reads);
	const dir = path.dirname(file);
	const found = [];
	// static imports and dynamic ones: import('../community/Teditor')
	for (const m of src.matchAll(/(?:from\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
		const target = path.resolve(dir, m[1]);
		const hit = [`${target}.tsx`, `${target}.ts`, path.join(target, 'index.tsx'), path.join(target, 'index.ts')].find((candidate) => fs.existsSync(candidate));
		if (hit) found.push(hit);
	}
	imports.set(file, found);
}

const isUsed = (key) => used.has(key) || [...prefixes].some((prefix) => key.startsWith(prefix));

/* ---------- the report ---------- */
let failures = 0;
const section = (title, rows) => {
	console.log(`\n${title}: ${rows.length}`);
	for (const row of rows.slice(0, 60)) console.log(`  ${row}`);
	if (rows.length > 60) console.log(`  … and ${rows.length - 60} more`);
};

const missing = [...new Map(asked.filter(({ key }) => !english.has(key)).map((row) => [row.key, row])).values()].map(({ file, key }) => `${key}   (${file})`);
section('Keys the code asks for that English does not have', missing);
failures += missing.length;

for (const language of LANGUAGES.filter((l) => l !== 'en')) {
	const have = bases(language);
	const lacking = [...english].filter((key) => !have.has(key));
	section(`Keys English has that "${language}" does not`, lacking);
	failures += lacking.length;
	const extra = [...have].filter((key) => !english.has(key));
	section(`Keys "${language}" has that English does not`, extra);
	failures += extra.length;
}

const plural = [];
const pluralBases = new Set([...texts.en.keys()].filter((key) => PLURAL_SUFFIX.test(key)).map(base));
for (const key of pluralBases) {
	for (const language of LANGUAGES) {
		for (const form of PLURALS[language]) {
			if (!texts[language].has(`${key}_${form}`)) plural.push(`${language}: ${key}_${form}`);
		}
	}
}
section('Plural forms a language needs and does not have', plural);
failures += plural.length;

const empty = LANGUAGES.flatMap((language) => [...texts[language]].filter(([, value]) => typeof value !== 'string' || value.trim() === '').map(([key]) => `${language}: ${key}`));
section('Empty texts', empty);
failures += empty.length;

// a page has to load every namespace that it, or anything it imports, reads
const reach = (file, seen = new Set()) => {
	if (seen.has(file)) return seen;
	seen.add(file);
	for (const next of imports.get(file) ?? []) reach(next, seen);
	return seen;
};
const pageProblems = [];
for (const file of sources.filter((f) => rel(f).startsWith('pages/') && !/\/_(app|document)\.tsx$/.test(rel(f)))) {
	const src = fs.readFileSync(file, 'utf8');
	const call = src.match(/pageTranslations\(\s*locale\s*(?:,\s*\[([^\]]*)\])?\s*\)/);
	if (!call) {
		pageProblems.push(`${rel(file)}: does not load translations (no pageTranslations in getStaticProps)`);
		continue;
	}
	const loaded = new Set([...SHARED_NS, ...[...(call[1] ?? '').matchAll(/['"]([\w-]+)['"]/g)].map((m) => m[1])]);
	const needed = new Set();
	for (const reached of reach(file)) for (const ns of fileNamespaces.get(reached) ?? []) needed.add(ns);
	const lacking = [...needed].filter((ns) => !loaded.has(ns));
	if (lacking.length > 0) pageProblems.push(`${rel(file)}: needs ${lacking.join(', ')}`);
	const spare = [...loaded].filter((ns) => !needed.has(ns) && !SHARED_NS.includes(ns));
	if (spare.length > 0) console.log(`  note: ${rel(file)} loads ${spare.join(', ')} and nothing on it reads it`);
}
section('Pages that do not load a namespace they read', pageProblems);
failures += pageProblems.length;

const unused = [...english].filter((key) => !isUsed(key));
section('Keys no code asks for (unused)', unused);

const count = (language) => texts[language].size;
console.log(`\n${namespaces.length} namespaces; texts: ${LANGUAGES.map((l) => `${l} ${count(l)}`).join(', ')}; keys used by the code: ${[...english].filter(isUsed).length} of ${english.size}`);
console.log(failures === 0 ? 'i18n check passed: nothing is missing.' : `i18n check FAILED: ${failures} problem(s).`);
process.exit(failures === 0 ? 0 : 1);

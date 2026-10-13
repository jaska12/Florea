import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Only pages import this file (in getStaticProps): it reads the locale files from disk.

export type Namespace =
	| 'common'
	| 'ai'
	| 'home'
	| 'product'
	| 'agent'
	| 'community'
	| 'order'
	| 'mypage'
	| 'member'
	| 'account'
	| 'cs'
	| 'admin';

/** on every page: the navbar, the footer, the chat, the bell, product cards, and the gift assistant **/
const SHARED: Namespace[] = ['common', 'ai'];

/** the translations a page needs: the shared ones and its own. `yarn i18n:check` verifies the list of each page. **/
export const pageTranslations = (locale: string | undefined, namespaces: Namespace[] = []) =>
	serverSideTranslations(locale ?? 'en', [...SHARED, ...namespaces]);

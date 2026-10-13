import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import NoticePanel from '../../../libs/components/admin/cs/NoticePanel';
import { NoticeCategory } from '../../../libs/enums/notice.enum';
import { pageTranslations } from '../../../libs/i18n/server';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await pageTranslations(locale, ['admin'])),
	},
});

const AdminNotice: NextPage = () => {
	return <NoticePanel category={NoticeCategory.NOTICE} />;
};

export default withAdminLayout(AdminNotice);

import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import NoticePanel from '../../../libs/components/admin/cs/NoticePanel';
import { NoticeCategory } from '../../../libs/enums/notice.enum';

const FaqArticles: NextPage = () => {
	return <NoticePanel category={NoticeCategory.FAQ} />;
};

export default withAdminLayout(FaqArticles);

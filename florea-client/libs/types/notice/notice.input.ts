import { NoticeCategory, NoticeStatus, NoticeTopic } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeTopic?: NoticeTopic;
	noticeEvent?: boolean;
	noticeTitle: string;
	noticeContent: string;
}

export interface NoticeUpdate {
	_id: string;
	noticeStatus?: NoticeStatus;
	noticeTopic?: NoticeTopic;
	noticeEvent?: boolean;
	noticeTitle?: string;
	noticeContent?: string;
}

interface NoticeSearch {
	noticeCategory: NoticeCategory;
	noticeTopic?: NoticeTopic;
	text?: string;
}

export interface NoticesInquiry {
	page: number;
	limit: number;
	direction?: Direction;
	search: NoticeSearch;
}

interface AllNoticesSearch {
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeTopic?: NoticeTopic;
	text?: string;
}

export interface AllNoticesInquiry {
	page: number;
	limit: number;
	direction?: Direction;
	search: AllNoticesSearch;
}

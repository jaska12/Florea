import { NoticeCategory, NoticeStatus, NoticeTopic } from '../../enums/notice.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../product/product';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTopic?: NoticeTopic;
	noticeEvent: boolean;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
}

export interface Notices {
	list: Notice[];
	metaCounter: TotalCounter[];
}

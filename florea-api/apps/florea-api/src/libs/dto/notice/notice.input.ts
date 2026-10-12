import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'bson';
import { NoticeCategory, NoticeStatus, NoticeTopic } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class NoticeInput {
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsOptional()
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@IsOptional()
	@Field(() => NoticeTopic, { nullable: true })
	noticeTopic?: NoticeTopic;

	@IsOptional()
	@IsBoolean()
	@Field(() => Boolean, { nullable: true })
	noticeEvent?: boolean;

	@IsNotEmpty()
	@Length(3, 150)
	@Field(() => String)
	noticeTitle: string;

	@IsNotEmpty()
	@Length(3, 2000)
	@Field(() => String)
	noticeContent: string;

	memberId?: ObjectId;
}

@InputType()
class NoticeSearch {
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsOptional()
	@Field(() => NoticeTopic, { nullable: true })
	noticeTopic?: NoticeTopic;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

/** what visitors ask for: active entries of one category **/
@InputType()
export class NoticesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => NoticeSearch)
	search: NoticeSearch;
}

@InputType()
class AllNoticesSearch {
	@IsOptional()
	@Field(() => NoticeCategory, { nullable: true })
	noticeCategory?: NoticeCategory;

	@IsOptional()
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@IsOptional()
	@Field(() => NoticeTopic, { nullable: true })
	noticeTopic?: NoticeTopic;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class AllNoticesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => AllNoticesSearch)
	search: AllNoticesSearch;
}

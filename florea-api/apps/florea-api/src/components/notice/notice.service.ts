import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { AllNoticesInquiry, NoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { NoticeUpdate } from '../../libs/dto/notice/notice.update';
import { NoticeCategory, NoticeStatus } from '../../libs/enums/notice.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { lookupMember } from '../../libs/config';
import { T } from '../../libs/types/common';

// what a visitor types is searched as plain text, not as a pattern
const asPlainText = (text: string): RegExp => new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

@Injectable()
export class NoticeService {
	constructor(@InjectModel('Notice') private readonly noticeModel: Model<Notice>) {}

	/** VISITORS **/

	// Only active entries are public: notices for the customer-care page, and the FAQ.
	public async getNotices(input: NoticesInquiry): Promise<Notices> {
		const { noticeCategory, noticeTopic, text } = input.search;
		const match: T = { noticeStatus: NoticeStatus.ACTIVE, noticeCategory: noticeCategory };
		if (noticeTopic) match.noticeTopic = noticeTopic;
		if (text) match.noticeTitle = { $regex: asPlainText(text) };

		return await this.listNotices(match, input, false);
	}

	/** ADMIN **/

	public async createNoticeByAdmin(memberId: ObjectId, input: NoticeInput): Promise<Notice> {
		// an FAQ entry belongs to one topic, so the page can group it
		if (input.noticeCategory === NoticeCategory.FAQ && !input.noticeTopic) {
			throw new BadRequestException(Message.NOTICE_TOPIC_REQUIRED);
		}

		try {
			return (await this.noticeModel.create({
				...input,
				noticeTitle: input.noticeTitle.trim(),
				noticeContent: input.noticeContent.trim(),
				memberId: memberId,
			})) as unknown as Notice;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async updateNoticeByAdmin(input: NoticeUpdate): Promise<Notice> {
		const { _id, ...changes } = input;
		if (changes.noticeTitle) changes.noticeTitle = changes.noticeTitle.trim();
		if (changes.noticeContent) changes.noticeContent = changes.noticeContent.trim();

		const result = (await this.noticeModel.findByIdAndUpdate(_id, changes, { new: true }).exec()) as unknown as Notice;
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	// As with products, an entry is removed for good only after it was given the DELETE status.
	public async removeNoticeByAdmin(noticeId: ObjectId): Promise<Notice> {
		const result = (await this.noticeModel
			.findOneAndDelete({ _id: noticeId, noticeStatus: NoticeStatus.DELETE })
			.exec()) as unknown as Notice;
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}

	public async getAllNoticesByAdmin(input: AllNoticesInquiry): Promise<Notices> {
		const { noticeCategory, noticeStatus, noticeTopic, text } = input.search;
		const match: T = {};
		if (noticeCategory) match.noticeCategory = noticeCategory;
		if (noticeStatus) match.noticeStatus = noticeStatus;
		if (noticeTopic) match.noticeTopic = noticeTopic;
		if (text) match.noticeTitle = { $regex: asPlainText(text) };

		return await this.listNotices(match, input, true);
	}

	/** SHARED **/

	private async listNotices(
		match: T,
		input: NoticesInquiry | AllNoticesInquiry,
		withWriter: boolean,
	): Promise<Notices> {
		const { page, limit } = input;
		const writer: any[] = withWriter
			? [lookupMember, { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } }]
			: [];

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: input.direction ?? Direction.DESC, _id: input.direction ?? Direction.DESC } },
				{
					$facet: {
						list: [{ $skip: (page - 1) * limit }, { $limit: limit }, ...writer],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { NotificationInput, NotificationsInquiry } from '../../libs/dto/notification/notification.input';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { lookupAuthorData } from '../../libs/config';
import { T } from '../../libs/types/common';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

	/** called by the like, comment and follow logic **/

	// A notification must never break the action that caused it, so a failure here is logged and not thrown.
	public async createNotification(input: NotificationInput): Promise<Notification | null> {
		if (!input.receiverId || input.authorId.toString() === input.receiverId.toString()) return null;

		try {
			return (await this.notificationModel.create(input)) as unknown as Notification;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			return null;
		}
	}

	// Taking a like or a subscription back removes its notification.
	public async removeNotification(input: NotificationInput): Promise<void> {
		const { notificationType, notificationGroup, authorId, receiverId, notificationRefId } = input;
		if (!receiverId) return;

		try {
			const search: T = { notificationType, notificationGroup, authorId, receiverId };
			if (notificationRefId) search.notificationRefId = notificationRefId;
			await this.notificationModel.deleteMany(search).exec();
		} catch (err) {
			console.log('Error, Service.model:', err.message);
		}
	}

	// modifier comes from LikeService.toggleLike: 1 for a new like, -1 for a like taken back
	public async likeNotification(modifier: number, input: NotificationInput): Promise<void> {
		if (modifier === 1) await this.createNotification(input);
		else await this.removeNotification(input);
	}

	/** called by the resolver **/

	public async getNotifications(memberId: ObjectId, input: NotificationsInquiry): Promise<Notifications> {
		const { page, limit, search } = input;
		const match: T = { receiverId: memberId };
		if (search?.notificationStatus) match.notificationStatus = search.notificationStatus;

		const result = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: Direction.DESC } },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupAuthorData,
							{ $unwind: { path: '$authorData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const unreadCount = await this.notificationModel
			.countDocuments({ receiverId: memberId, notificationStatus: NotificationStatus.WAIT })
			.exec();

		return { list: result[0].list, metaCounter: result[0].metaCounter, unreadCount: unreadCount };
	}

	public async readNotification(memberId: ObjectId, notificationId: ObjectId): Promise<Notification> {
		const result = (await this.notificationModel
			.findOneAndUpdate(
				{ _id: notificationId, receiverId: memberId },
				{ notificationStatus: NotificationStatus.READ },
				{ new: true },
			)
			.exec()) as unknown as Notification;

		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result;
	}

	public async readAllNotifications(memberId: ObjectId): Promise<number> {
		const result = await this.notificationModel
			.updateMany(
				{ receiverId: memberId, notificationStatus: NotificationStatus.WAIT },
				{ notificationStatus: NotificationStatus.READ },
			)
			.exec();

		return result.modifiedCount;
	}
}

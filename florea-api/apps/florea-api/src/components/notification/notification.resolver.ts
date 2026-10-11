import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'bson';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { NotificationsInquiry } from '../../libs/dto/notification/notification.input';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(AuthGuard)
	@Query((returns) => Notifications)
	public async getNotifications(
		@Args('input') input: NotificationsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notifications> {
		console.log('Query: getNotifications');
		return await this.notificationService.getNotifications(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Notification)
	public async readNotification(
		@Args('input') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notification> {
		console.log('Mutation: readNotification');
		const notificationId = shapeIntoMongoObjectId(input);
		return await this.notificationService.readNotification(memberId, notificationId);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Int)
	public async readAllNotifications(@AuthMember('_id') memberId: ObjectId): Promise<number> {
		console.log('Mutation: readAllNotifications');
		return await this.notificationService.readAllNotifications(memberId);
	}
}

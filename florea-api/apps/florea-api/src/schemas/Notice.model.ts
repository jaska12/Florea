import { Schema } from 'mongoose';
import { NoticeCategory, NoticeStatus, NoticeTopic } from '../libs/enums/notice.enum';

const NoticeSchema = new Schema(
    {
        noticeCategory: {
            type: String,
            enum: NoticeCategory,
            required: true,
        },

        noticeStatus: {
            type: String,
            enum: NoticeStatus,
            default: NoticeStatus.HOLD,
        },

        // for an FAQ entry: the group it is shown under
        noticeTopic: {
            type: String,
            enum: NoticeTopic,
        },

        // for a notice: shown with the "event" badge
        noticeEvent: {
            type: Boolean,
            default: false,
        },

        noticeTitle: {
            type: String,
            required: true,
        },

        noticeContent: {
            type: String,
            required: true,
        },

        memberId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Member',
        },
    },
    { timestamps: true, collection: 'notices' },
);

NoticeSchema.index({ noticeCategory: 1, noticeStatus: 1, createdAt: -1 });

export default NoticeSchema;

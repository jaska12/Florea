import { ObjectId } from 'bson';

export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
export const availableOptions = ['productSameDay', 'productGiftWrap'];
export const availableProductSorts = [
    'createdAt',
    'updatedAt',
    'productLikes',
    'productViews',
    'productRank',
    'productPrice',
];
export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews'];
export const availableCommentSorts = ['createdAt', 'updatedAt'];

/** ORDER CONFIGURATION **/
// Prices are whole Korean won (KRW). The client shows the same rule from its own libs/config.ts.
// one fee for each order (each florist delivers separately); free when the items reach the second amount
export const DELIVERY_FEE = 4000;
export const FREE_DELIVERY_FROM = 50000;
/** the lowest price a product may have, in won **/
export const MIN_PRODUCT_PRICE = 1000;

/** IMAGE CONFIGURATION **/
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

import { T } from './types/common';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
    const ext = path.parse(filename).ext;
    return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
    return typeof target === 'string' ? new ObjectId(target) : target;
};

export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
    return {
        $lookup: {
            from: 'likes',
            let: {
                localLikeRefId: targetRefId,
                localMemberId: memberId,
                localMyFavorite: true,
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$likeRefId', '$$localLikeRefId'] },
                                { $eq: ['$memberId', '$$localMemberId'] },
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        memberId: 1,
                        likeRefId: 1,
                        myFavorite: '$$localMyFavorite',
                    },
                },
            ],
            as: 'meLiked',
        },
    };
};

interface LookupAuthMemberFollowed {
    followerId: T;
    followingId: string;
}

export const lookupAuthMemberFollowed = (input: LookupAuthMemberFollowed) => {
    const { followerId, followingId } = input;
    return {
        $lookup: {
            from: 'follows',
            let: {
                localFollowerId: followerId,
                localFollowingId: followingId,
                localMyFavorite: true,
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$followerId', '$$localFollowerId'] },
                                { $eq: ['$followingId', '$$localFollowingId'] },
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        followerId: 1,
                        followingId: 1,
                        myFollowing: '$$localMyFavorite',
                    },
                },
            ],
            as: 'meFollowed',
        },
    };
};

export const lookupMember = {
    $lookup: {
        from: 'members',
        localField: 'memberId',
        foreignField: '_id',
        as: 'memberData',
    },
};

export const lookupFollowingData = {
    $lookup: {
        from: 'members',
        localField: 'followingId',
        foreignField: '_id',
        as: 'followingData',
    },
};

export const lookupFollowerData = {
    $lookup: {
        from: 'members',
        localField: 'followerId',
        foreignField: '_id',
        as: 'followerData',
    },
};

export const lookupAuthorData = {
    $lookup: {
        from: 'members',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorData',
    },
};

export const lookupFavorite = {
    $lookup: {
        from: 'members',
        localField: 'favoriteProduct.memberId',
        foreignField: '_id',
        as: 'favoriteProduct.memberData',
    },
};

export const lookupVisit = {
    $lookup: {
        from: 'members',
        localField: 'visitedProduct.memberId',
        foreignField: '_id',
        as: 'visitedProduct.memberData',
    },
};

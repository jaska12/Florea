import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
    BOUQUET = 'BOUQUET',
    FLOWER = 'FLOWER',
    PLANT = 'PLANT',
    GIFT_BOX = 'GIFT_BOX',
    SWEET = 'SWEET',
    TOY = 'TOY',
    OTHER = 'OTHER',
}
registerEnumType(ProductType, {
    name: 'ProductType',
});

export enum ProductStatus {
    HOLD = 'HOLD',
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
    name: 'ProductStatus',
});

export enum ProductLocation {
    SEOUL = 'SEOUL',
    BUSAN = 'BUSAN',
    INCHEON = 'INCHEON',
    DAEGU = 'DAEGU',
    GYEONGJU = 'GYEONGJU',
    GWANGJU = 'GWANGJU',
    CHONJU = 'CHONJU',
    DAEJON = 'DAEJON',
    JEJU = 'JEJU',
}
registerEnumType(ProductLocation, {
    name: 'ProductLocation',
});

export enum ProductOccasion {
    BIRTHDAY = 'BIRTHDAY',
    WEDDING = 'WEDDING',
    ANNIVERSARY = 'ANNIVERSARY',
    LOVE = 'LOVE',
    CONGRATS = 'CONGRATS',
    SYMPATHY = 'SYMPATHY',
    OTHER = 'OTHER',
}
registerEnumType(ProductOccasion, {
    name: 'ProductOccasion',
});

export enum ProductSize {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE',
    DELUXE = 'DELUXE',
}
registerEnumType(ProductSize, {
    name: 'ProductSize',
});

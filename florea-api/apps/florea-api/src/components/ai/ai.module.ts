import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiResolver } from './ai.resolver';
import { AiService } from './ai.service';
import { AiClient } from './ai.client';
import ProductSchema from '../../schemas/Product.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]), AuthModule],
	providers: [AiResolver, AiService, AiClient],
})
export class AiModule {}

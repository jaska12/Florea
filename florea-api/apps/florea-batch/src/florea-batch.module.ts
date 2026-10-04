import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FloreaBatchController } from './florea-batch.controller';
import { FloreaBatchService } from './florea-batch.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FloreaBatchController],
  providers: [FloreaBatchService],
})
export class FloreaBatchModule { }

import { Controller, Get } from '@nestjs/common';
import { FloreaBatchService } from './florea-batch.service';

@Controller()
export class FloreaBatchController {
  constructor(private readonly floreaBatchService: FloreaBatchService) {}

  @Get()
  getHello(): string {
    return this.floreaBatchService.getHello();
  }
}

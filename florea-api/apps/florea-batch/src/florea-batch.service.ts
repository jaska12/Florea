import { Injectable } from '@nestjs/common';

@Injectable()
export class FloreaBatchService {
  getHello(): string {
    return 'Welcome to Florea BATCH Server!';
  }
}

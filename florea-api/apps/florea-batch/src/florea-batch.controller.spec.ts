import { Test, TestingModule } from '@nestjs/testing';
import { FloreaBatchController } from './florea-batch.controller';
import { FloreaBatchService } from './florea-batch.service';

describe('FloreaBatchController', () => {
  let floreaBatchController: FloreaBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FloreaBatchController],
      providers: [FloreaBatchService],
    }).compile();

    floreaBatchController = app.get<FloreaBatchController>(FloreaBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(floreaBatchController.getHello()).toBe('Hello World!');
    });
  });
});

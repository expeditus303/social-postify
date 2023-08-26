import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('/health => should get an alive message', () => {
    it('should return "I’m okay!"', () => {
      const value = appController.getHealth()
      expect(value).toBe('I’m okay!');
    });
  });
});

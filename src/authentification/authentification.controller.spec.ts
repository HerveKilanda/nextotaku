import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationService } from './authentification.service';
import { AuthentificationController } from './authentification.controller';

describe('AuthentificationController', () => {
  let controller: AuthentificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthentificationController],
      providers: [AuthentificationService],
    }).compile();

    controller = module.get<AuthentificationController>(
      AuthentificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

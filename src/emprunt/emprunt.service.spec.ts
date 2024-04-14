import { Test, TestingModule } from '@nestjs/testing';
import { EmpruntService } from './emprunt.service';

describe('EmpruntService', () => {
  let service: EmpruntService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpruntService],
    }).compile();

    service = module.get<EmpruntService>(EmpruntService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

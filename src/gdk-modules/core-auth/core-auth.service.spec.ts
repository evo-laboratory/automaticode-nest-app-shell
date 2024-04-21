import { Test, TestingModule } from '@nestjs/testing';
import { CoreAuthService } from '@gdk/core-auth/core-auth.service';

describe('CoreAuthService', () => {
  let service: CoreAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreAuthService],
    }).compile();

    service = module.get<CoreAuthService>(CoreAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

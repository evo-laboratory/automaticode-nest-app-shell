import { Test, TestingModule } from '@nestjs/testing';
import { CoreAuthController } from '@gdk/core-auth/core-auth.controller';

describe('CoreAuthController', () => {
  let controller: CoreAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreAuthController],
    }).compile();

    controller = module.get<CoreAuthController>(CoreAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

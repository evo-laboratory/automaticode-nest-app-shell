import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseAuthController } from '@gdk/firebase/firebase-auth/firebase-auth.controller';
import { FirebaseAuthService } from '@gdk/firebase/firebase-auth/firebase-auth.service';

describe('FirebaseAuthController', () => {
  let controller: FirebaseAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseAuthController],
      providers: [FirebaseAuthService],
    }).compile();

    controller = module.get<FirebaseAuthController>(FirebaseAuthController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});

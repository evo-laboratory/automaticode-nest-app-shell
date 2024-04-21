import { Module } from '@nestjs/common';
import { FirebaseAuthService } from '@gdk/firebase/firebase-auth/firebase-auth.service';
import { FirebaseAuthController } from './firebase-auth/firebase-auth.controller';

@Module({
  providers: [FirebaseAuthService],
  exports: [FirebaseAuthService],
  controllers: [FirebaseAuthController],
})
export class FirebaseModule {}

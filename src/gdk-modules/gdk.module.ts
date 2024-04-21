import { Module } from '@nestjs/common';
import { UserModule } from '@gdk/user/user.module';
import { FirebaseModule } from './firebase/firebase.module';
import { CoreAuthModule } from './core-auth/core-auth.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { GENERATED_MODULES } from './generated-modules-list';

@Module({
  imports: [
    FirebaseModule,
    CoreAuthModule,
    AuthModule,
    UserModule,
    MailModule,
    ...GENERATED_MODULES,
  ],
})
export class GdkModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '@gdk/mail/mail.module';
import { UserAuthEventsListener } from './listeners/user-auth-events.listener';
import { UserModel } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
@Module({
  imports: [MailModule, MongooseModule.forFeature([UserModel])],
  providers: [UserAuthEventsListener, UserService],
  controllers: [UserController],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { SendgridMailService } from './sendgrid-mail/sendgrid-mail.service';
import { MailController } from './mail.controller';

@Module({
  providers: [SendgridMailService],
  exports: [SendgridMailService],
  controllers: [MailController],
})
export class MailModule {}

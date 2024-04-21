import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GPI, MAIL_API, MAIL_SENDGRID_PATH, VER_1 } from '@shared/types/gdk';
import { SendgridMailService } from './sendgrid-mail/sendgrid-mail.service';
import { MailSendGridSendDto } from './dto/mail-sendgrid-send.dto';

@ApiTags(`${MAIL_API}`)
@Controller(`${GPI}/${MAIL_API}`)
export class MailController {
  constructor(private readonly sendgridMail: SendgridMailService) {}

  @Post(`${VER_1}/${MAIL_SENDGRID_PATH}`)
  async sendgridSendV1(@Body() dto: MailSendGridSendDto) {
    return await this.sendgridMail.send(dto);
  }
}

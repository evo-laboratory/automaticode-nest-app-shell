import { Injectable } from '@nestjs/common';
import { MethodLogger } from '@shared/loggers/method-logger.decorator';
import SendGridSDK from '@vendors/sendgrid/sendgrid';
import {
  ISendGridSendMail,
  ISendGridSendMailResItem,
} from '@shared/types/gdk/sendgrid.type';
import { ClientResponse } from '@sendgrid/mail';

@Injectable()
export class SendgridMailService {
  private DEFAULT_SENDER = process.env.SENDGRID_SENDER_EMAIL;

  @MethodLogger()
  public async send(
    dto: ISendGridSendMail,
  ): Promise<ISendGridSendMailResItem[]> {
    try {
      const sent: [ClientResponse, object] = await SendGridSDK.send({
        to: dto.to,
        from: dto.from ? dto.from : this.DEFAULT_SENDER,
        subject: dto.subject,
        text: dto.text,
        html: dto.html,
      });
      const result = sent as unknown as ISendGridSendMailResItem[];
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

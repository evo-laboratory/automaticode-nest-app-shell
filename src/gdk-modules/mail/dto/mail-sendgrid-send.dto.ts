import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ISendGridSendMail } from '@shared/types/gdk/sendgrid.type';

export class MailSendGridSendDto implements ISendGridSendMail {
  @IsEmail()
  to: string;

  @IsOptional()
  @IsEmail()
  from?: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsString()
  html: string;
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public checkEnv(): any {
    return {
      STAGE: process.env.STAGE,
      PORT: process.env.PORT || 4500,
      DISABLE_ERROR_META: process.env.DISABLE_ERROR_META,
      AUTH_CODE_EXPIRE_MIN: Number(process.env.AUTH_CODE_EXPIRE_MIN || 0),
      SENDGRID_SENDER_EMAIL: process.env.SENDGRID_SENDER_EMAIL,
      MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    };
  }
}

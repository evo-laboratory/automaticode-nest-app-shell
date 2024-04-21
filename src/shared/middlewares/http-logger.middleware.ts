// * GDK Application Shell Default File
import { Injectable, NestMiddleware } from '@nestjs/common';
import Logger from '@shared/loggers/winston.logger';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    Logger.http(`[Controller] ${req.method} ${req.url}`);
    next();
  }
}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GdkModule } from '@gdk/gdk.module';
import { DefaultEventsListener } from '@shared/listeners/default-events.listener';
import { HttpLoggerMiddleware } from '@shared/middlewares/http-logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GdkModule,
    MongooseModule.forRoot(
      `${process.env.MONGO_URI || 'mongodb://localhost:27017?replicaSet=rs'}`,
      {
        autoCreate: true,
        dbName: `${process.env.MONGO_DB_NAME || 'nestjs-starter'}`,
      },
    ),
  ],
  controllers: [AppController],
  providers: [DefaultEventsListener, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

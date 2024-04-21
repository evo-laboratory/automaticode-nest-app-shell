// * GDK Application Shell Default File
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import Logger from '@shared/loggers/winston.logger';
import { MethodLogger } from '@shared/loggers/method-logger.decorator';
import { EventListenerErrorEvent } from '@shared/events/event-listener-error.event';
import { LISTENER_ERROR_EVENT } from '@shared/types/gdk';
@Injectable()
export class DefaultEventsListener {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent(LISTENER_ERROR_EVENT)
  @MethodLogger()
  async defaultEventErrorListener(event: EventListenerErrorEvent) {
    Logger.error(
      `${event.sourceEvent} handle by ${event.sourceHandlerName} failed`,
    );
  }
}

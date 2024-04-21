// * GDK Application Shell Default File
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventListenerFactoryEmitBack } from '@shared/types/gdk';
@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public promisedListener<T>(
    eventName: string,
    emitBackEventName: string,
    eventPayload: any,
    timeoutSecond = 3,
  ): Promise<IEventListenerFactoryEmitBack<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.eventEmitter.emit(eventName, eventPayload);
      }, 50);
      setTimeout(() => {
        resolve({
          eventName: eventName,
          payload: null,
          isTimeout: true,
          isError: false,
        });
      }, timeoutSecond * 1000);
      this.eventEmitter.once(emitBackEventName, (result: T) => {
        resolve({
          eventName: eventName,
          payload: result,
          isError: false,
          isTimeout: false,
        });
      });
    });
  }
}

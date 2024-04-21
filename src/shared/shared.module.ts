import { Module } from '@nestjs/common';
import { EventService } from './services/event/event.service';

@Module({
  providers: [EventService],
  exports: [EventService],
})
export class SharedModule {}

import { Module } from '@nestjs/common';
import { CoreAuthService } from '@gdk/core-auth/core-auth.service';
import { CoreAuthController } from '@gdk/core-auth/core-auth.controller';

@Module({
  providers: [CoreAuthService],
  controllers: [CoreAuthController],
})
export class CoreAuthModule {}

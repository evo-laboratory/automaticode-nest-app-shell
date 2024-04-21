// * GDK Application Shell Default File
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IDecodedBaseIdToken, VERIFIED_TOKEN_KEY } from '@shared/types/gdk';

export const VerifiedToken = createParamDecorator<IDecodedBaseIdToken>(
  (data: unknown, ctx: ExecutionContext): IDecodedBaseIdToken => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers[`${VERIFIED_TOKEN_KEY}`];
  },
);

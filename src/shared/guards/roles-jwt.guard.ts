import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CheckTwoArrayHasCommon } from '@shared/helper/helper';
import { MethodLogger } from '@shared/loggers/method-logger.decorator';
import { ROLES_KEY, VERIFIED_TOKEN_KEY } from '@shared/types/gdk';

@Injectable()
export class RolesJwtGuard implements CanActivate {

  @MethodLogger()
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = Reflect.getMetadata(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    // * Check ValidateToken
    const request = context.switchToHttp().getRequest();
    const idToken =  request.headers[`${VERIFIED_TOKEN_KEY}`]; // * IDecodedBaseIdToken
    if (!idToken) {
      return false;
    }
    const accessorRoles = idToken.roles || [];
    return CheckTwoArrayHasCommon(requiredRoles, accessorRoles);
  }
}

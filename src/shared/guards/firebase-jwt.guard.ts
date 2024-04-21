// * GDK Application Shell Default File
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { VERIFIED_TOKEN_KEY } from '@shared/types/gdk';
import { FirebaseAdminAuth } from '@vendors/firebase/firebase-admin-app';

@Injectable()
export class FirebaseJwtGuard implements CanActivate {
  // * Firebase using Id and Access Token as verification.
  private FirebaseAdminAuth = FirebaseAdminAuth;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = await this.FirebaseAdminAuth.verifyIdToken(token, true);
      request.headers[`${VERIFIED_TOKEN_KEY}`] = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

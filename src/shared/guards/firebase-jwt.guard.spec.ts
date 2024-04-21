import { FirebaseJwtGuard } from './firebase-jwt.guard';

describe('JwtGuard', () => {
  it('should be defined', () => {
    expect(new FirebaseJwtGuard()).toBeDefined();
  });
});

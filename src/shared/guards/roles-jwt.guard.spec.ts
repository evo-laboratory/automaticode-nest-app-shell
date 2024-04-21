import { RolesJwtGuard } from './roles-jwt.guard';

describe('RolesJwtGuard', () => {
  it('should be defined', () => {
    expect(new RolesJwtGuard()).toBeDefined();
  });
});

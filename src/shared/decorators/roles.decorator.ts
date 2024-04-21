import { ROLE } from '@gdk/user/role.static';
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@shared/types/gdk';

export const Roles = ( args: ROLE[]) => SetMetadata(`${ROLES_KEY}`, args);

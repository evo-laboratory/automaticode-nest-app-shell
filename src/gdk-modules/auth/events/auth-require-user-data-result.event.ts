import { IUser } from '@gdk/user/user.type';
import { IAuthRequireUserDataResultEvent } from '@shared/types/gdk';

export class AuthRequireUserDataResultEvent
  implements IAuthRequireUserDataResultEvent
{
  constructor(public data: IUser) {}
}

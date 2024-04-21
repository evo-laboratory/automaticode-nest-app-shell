import { IUser } from '@gdk/user/user.type';
import { IAuthDeleteEvent, IAuthDeletedUserEvent } from '@shared/types/gdk';

export class AuthDeleteEvent implements IAuthDeleteEvent {
  constructor(public uid: string) {}
}

export class AuthDeletedUserEvent implements IAuthDeletedUserEvent {
  constructor(public data: IUser) {}
}

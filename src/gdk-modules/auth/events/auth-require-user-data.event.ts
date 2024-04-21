import { IAuthRequireUserDataEvent } from '@shared/types/gdk';
export class AuthRequireUserDataEvent implements IAuthRequireUserDataEvent {
  constructor(public uid: string, public email: string) {}
}

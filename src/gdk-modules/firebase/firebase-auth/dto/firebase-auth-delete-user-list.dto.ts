import { IsString } from 'class-validator';

export class FirebaseAuthDeleteUserListDto {
  @IsString()
  uidList: string;
}

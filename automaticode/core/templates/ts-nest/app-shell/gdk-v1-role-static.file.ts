import { KebabToConstantCase } from '../../../utils/help';

export const ROLE_STATIC_FILE_NAME = 'role.static';
export default function GDKV1RoleStaticFile(roles: string[]) {
  return `export enum ROLE {
    ${roles
      .map((r) => `${KebabToConstantCase(r)} = '${KebabToConstantCase(r)}'`)
      .join(',\n')}
  }
`;
}

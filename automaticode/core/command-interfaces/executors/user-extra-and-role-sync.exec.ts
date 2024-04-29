import * as AutomaticodeJSON from '../../../../automaticode.json';
import GDKV1RoleStaticFile, {
  ROLE_STATIC_FILE_NAME,
} from '../../templates/ts-nest/app-shell/gdk-v1-role-static.file';
import { CheckFileExist, DeleteFile, WriteFile } from '../../utils/file';
export default async function UserExtraSchemaAndRoleSyncExec() {
  try {
    // ! dev-user is for developing, please change back to user
    const USER_FOLDER = `${AutomaticodeJSON.Config.GDKOutPutFolder}/dev-user`;
    const ROLE_STATIC_PATH = `${USER_FOLDER}/${ROLE_STATIC_FILE_NAME}.ts`;
    const isFileExist = await CheckFileExist(ROLE_STATIC_PATH);
    // * Sync Role
    if (isFileExist) {
      // * Delete First
      await DeleteFile(ROLE_STATIC_PATH);
    }
    await WriteFile(
      ROLE_STATIC_PATH,
      GDKV1RoleStaticFile(AutomaticodeJSON.Auth.Roles),
    );
    // * Update User Modules
    // * STEP 1. Check if set user-extra is schemas/
    // * STEP 2. Remove exist files
    // * STEP 3. Regenerate files base on user-extra
  } catch (error) {
    console.log('[SYNC] Role failed');
  }
}

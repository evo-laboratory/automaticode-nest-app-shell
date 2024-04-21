import * as AutomaticodeJSON from '../../../../automaticode.json';
import { ReadGDKDirectoryFolderNames, ReadSchemaDirectoryFileNames } from "../../utils/file";

export default async function ScanSchemas() {
  const GDK_FOLDER = `${AutomaticodeJSON.Config.GDKOutPutFolder}`;
  // * Read schemas/
  const schemaJSONfileNames = await ReadSchemaDirectoryFileNames();
  // * Check under GDK/
  const gdkDirNames = await ReadGDKDirectoryFolderNames();
  const report = schemaJSONfileNames.map((s) => {
    const moduleName = s.split('.json')[0];
    const isGenerated = gdkDirNames.includes(moduleName);
    return {
      SchemaJSON: s,
      Generated: isGenerated,
      At: 0 // TODO, need to cache the last generate date
    }
  });
  console.table(report);
}

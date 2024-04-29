import * as AutomaticodeJSON from '../../../../automaticode.json';
import GDKV1GeneratedModuleListFile from '../../templates/project/gdk-v1-generated-module-list.file';
import {
  GENERATE_LIST_FILE_NAME,
  RESERVED_SCHEMA_NAMES,
} from '../../types/generator.static';
import {
  GDKSchema,
  GDK_PROPERTY_TYPE,
  IProcessedGDKSchema,
} from '../../types/generator.type';
import {
  CheckFileExist,
  DeleteFile,
  ReadSchemaDirectoryFileNames,
  ReadSchemaJSONFile,
  WriteFile,
} from '../../utils/file';
import { ProcessGDKSchemaJSONFile } from '../../utils/transformers';
import { TSNestGDKMongoGenerator } from '../generators/ts-nest/mongodb/ts-nest-gdk-mongo.generator';

export default async function GenerateGDKModulesExec() {
  try {
    // * STEP 1. Read JSON Files under Config
    const jsonFileNames = await ReadSchemaDirectoryFileNames();
    const FORBIDDEN_NAMES = RESERVED_SCHEMA_NAMES.concat([
      `${AutomaticodeJSON.Config.User.ExtraSchemaJsonName}`,
    ]);
    // * STEP 2. Filter out reserved names json
    const filteredJSONFileNames = jsonFileNames.filter((fileName: string) => {
      return !FORBIDDEN_NAMES.includes(fileName);
    });
    const gdkSchemas: IProcessedGDKSchema[] = await Promise.all(
      filteredJSONFileNames.map(async (file) => {
        const fileContent = (await ReadSchemaJSONFile(
          file,
        )) as unknown as GDKSchema<GDK_PROPERTY_TYPE>;
        const schema = ProcessGDKSchemaJSONFile(fileContent);
        return schema;
      }),
    );
    // * STEP 3. Validate JSON
    // TODO
    // * STEP 4. Call Generator
    await Promise.all(
      gdkSchemas.map(async (gSchema) => {
        await TSNestGDKMongoGenerator(gSchema);
      }),
    );
    // * STEP 5. Update GenerateModuleList
    // * Generate Module List File
    const GENERATE_LIST_FILE = `${AutomaticodeJSON.Config.GDKOutPutFolder}/${GENERATE_LIST_FILE_NAME}.ts`;
    const moduleListFileExist = await CheckFileExist(GENERATE_LIST_FILE);
    if (moduleListFileExist) {
      await DeleteFile(GENERATE_LIST_FILE);
    }
    await WriteFile(
      GENERATE_LIST_FILE,
      GDKV1GeneratedModuleListFile(gdkSchemas),
    );
  } catch (error) {
    console.log(`GenerateGDKModulesExec Failed`);
    console.log(error);
  }
}

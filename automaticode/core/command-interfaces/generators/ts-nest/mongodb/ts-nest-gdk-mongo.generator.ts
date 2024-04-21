import * as AutomaticodeJSON from '../../../../../../automaticode.json';
import { GDKV1NestControllerFile } from '../../../../templates/ts-nest/common/gdk-v1-controller.file';
import { GDKV1NestModuleFile } from '../../../../templates/ts-nest/common/gdk-v1-module.file';
import { GDKV1NestSchemaCreateDtoFile } from '../../../../templates/ts-nest/common/gdk-v1-schema-create-dto.file';
import GDKV1SchemaStaticFile from '../../../../templates/ts-nest/common/gdk-v1-schema-static.file';
import GDKV1SchemaTypeFile from '../../../../templates/ts-nest/common/gdk-v1-schema-type.file';
import { GDKV1NestSchemaUpdateDtoFile } from '../../../../templates/ts-nest/common/gdk-v1-schema-update-dto.file';
import GDKV1TSNestMongooseSchemaFile from '../../../../templates/ts-nest/mongodb/gdk-v1-mongoose-schema.file';
import GDKV1TSNestMongooseServiceFile from '../../../../templates/ts-nest/mongodb/gdk-v1-mongoose-service.file';
import { DTOS_FOLDER_NAME } from '../../../../types/generator.static';
import { IProcessedGDKSchema } from '../../../../types/generator.type';
import {
  CheckDirExist,
  CreateDirUnderSrc,
  RemoveAllFilesUnderDir,
  WriteFile,
} from '../../../../utils/file';

export async function TSNestGDKMongoGenerator(schema: IProcessedGDKSchema) {
  const MODULE_FOLDER = `${AutomaticodeJSON.Config.GDKOutPutFolder}/${schema.kebabCaseName}`;
  const MODULE_DTO_FOLDER = `${MODULE_FOLDER}/${DTOS_FOLDER_NAME}`;
  const gdkFolder = `${AutomaticodeJSON.Config.GDKOutPutFolder}`.split(
    'src/',
  )[1];
  // * Check First
  const isDirExist = await CheckDirExist(MODULE_FOLDER);
  const isDtoDirExist = await CheckDirExist(MODULE_DTO_FOLDER);
  if (isDirExist) {
    console.log(`[WARNING] Removing all files under ${MODULE_FOLDER} ...`);
    await RemoveAllFilesUnderDir(MODULE_FOLDER);
  } else {
    await CreateDirUnderSrc(`${gdkFolder}/${schema.kebabCaseName}`);
  }
  if (isDtoDirExist) {
    console.log(`[WARNING] Removing all files under ${MODULE_DTO_FOLDER} ...`);
    await RemoveAllFilesUnderDir(MODULE_DTO_FOLDER);
  } else {
    await CreateDirUnderSrc(
      `${gdkFolder}/${schema.kebabCaseName}/${DTOS_FOLDER_NAME}`,
    );
  }
  // * Static
  await WriteFile(
    `${MODULE_FOLDER}/${schema.staticFileName}.ts`,
    GDKV1SchemaStaticFile(schema),
  );
  // * Type
  await WriteFile(
    `${MODULE_FOLDER}/${schema.typeFileName}.ts`,
    GDKV1SchemaTypeFile(schema),
  );
  // * Schema
  await WriteFile(
    `${MODULE_FOLDER}/${schema.schemaFileName}.ts`,
    GDKV1TSNestMongooseSchemaFile(schema),
  );
  // * DTOs
  await WriteFile(
    `${MODULE_DTO_FOLDER}/${schema.createDtoFileName}.ts`,
    GDKV1NestSchemaCreateDtoFile(schema),
  );
  await WriteFile(
    `${MODULE_DTO_FOLDER}/${schema.updateFullDtoFileName}.ts`,
    GDKV1NestSchemaUpdateDtoFile(schema),
  );
  // * Service
  await WriteFile(
    `${MODULE_FOLDER}/${schema.serviceFileName}.ts`,
    GDKV1TSNestMongooseServiceFile(schema),
  );
  // * Controller
  await WriteFile(
    `${MODULE_FOLDER}/${schema.controllerFileName}.ts`,
    GDKV1NestControllerFile(schema),
  );

  // * Module
  await WriteFile(
    `${MODULE_FOLDER}/${schema.moduleFileName}.ts`,
    GDKV1NestModuleFile(schema),
  );
}

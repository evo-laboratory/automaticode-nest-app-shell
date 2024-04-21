import { IProcessedGDKSchema } from '../../../types/generator.type';
export const MODULE_SUFFIX_NAME = 'module';
export function GDKV1NestModuleFile(schema: IProcessedGDKSchema) {
  return `import { Module } from '@nestjs/common';
  import { MongooseModule } from '@nestjs/mongoose';

  import { ${schema.mongoModelRefName} } from './${schema.schemaFileName}';
  import { ${schema.pascalCaseName}Controller } from './${schema.controllerFileName}';
  import { ${schema.pascalCaseName}Service } from './${schema.serviceFileName}';

  @Module({
    imports: [
      MongooseModule.forFeature([${schema.mongoModelRefName}]),
    ],
    controllers: [${schema.pascalCaseName}Controller],
    providers: [${schema.pascalCaseName}Service],
  })
  export class ${schema.pascalCaseName}Module {}
`;
}

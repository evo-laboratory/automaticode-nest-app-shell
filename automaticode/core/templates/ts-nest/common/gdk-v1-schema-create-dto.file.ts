import {
  GDK_PROPERTY_TYPE,
  IProcessedGDKSchema,
} from '../../../types/generator.type';
import { ResolveClassValidatorsImport } from '../../../utils/importers';
import {
  GetEnumConstantCase,
  PropsToDtoProps,
} from '../../../utils/transformers';
import { STATIC_SUFFIX_NAME } from './gdk-v1-schema-static.file';
import { TYPE_SUFFIX_NAME } from './gdk-v1-schema-type.file';
export const CREATE_DTO_PREFIX = 'create-';
export const UPDATE_FULL_DTO_PREFIX = 'update-full-';
export const DTO_SUFFIX = 'dto';

export function GDKV1NestSchemaCreateDtoFile(schema: IProcessedGDKSchema) {
  return `import {${schema.createFullDtoInterfaceName} } from '@gdk/${
    schema.kebabCaseName
  }/${schema.kebabCaseName}.${TYPE_SUFFIX_NAME}';
  ${ResolveClassValidatorsImport(schema)}
  ${_ResolveStaticImports(schema)}
  export class ${schema.createFullDtoName} implements ${
    schema.createFullDtoInterfaceName
  } {
    ${PropsToDtoProps(schema)}
}
`;
}

function _ResolveStaticImports(schema: IProcessedGDKSchema) {
  const enumProps = schema.properties.filter(
    (p) => p.type === GDK_PROPERTY_TYPE.ENUM_OPTION,
  );
  return `import {
    ${enumProps.map((eP) => GetEnumConstantCase(schema, eP))}
  } from '@gdk/${schema.kebabCaseName}/${
    schema.kebabCaseName
  }.${STATIC_SUFFIX_NAME}';
`;
}

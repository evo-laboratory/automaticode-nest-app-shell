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

export function GDKV1NestSchemaUpdateDtoFile(schema: IProcessedGDKSchema) {
  return `import { ${schema.updateFullDtoInterfaceName} } from '@gdk/${
    schema.kebabCaseName
  }/${schema.kebabCaseName}.${TYPE_SUFFIX_NAME}'
  ${ResolveClassValidatorsImport(schema)}
  ${_ResolveStaticImports(schema)}
  export class ${schema.updateFullDtoName} implements ${
    schema.updateFullDtoInterfaceName
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

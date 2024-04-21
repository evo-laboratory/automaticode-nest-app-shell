import {
  GDK_PROPERTY_TYPE,
  IProcessedGDKSchema,
} from '../../../types/generator.type';
import { KebabToConstantCase } from '../../../utils/help';
import { GetEnumConstantCase } from '../../../utils/transformers';

export const STATIC_SUFFIX_NAME = 'static';

export default function GDKV1SchemaStaticFile(schema: IProcessedGDKSchema) {
  return `export const ${schema.apiConstantPathName} = '${
    schema.apiConstantPath
  }';
  export const ${schema.mongoModelName} = '${schema.pascalCaseName}';
  ${_ResolveEnumCodes(schema)}
  `;
}

function _ResolveEnumCodes(schema: IProcessedGDKSchema) {
  const codes = schema.properties.reduce((result: string[], prop) => {
    if (
      prop.type === GDK_PROPERTY_TYPE.ENUM_OPTION &&
      prop.enumOptions.length > 0
    ) {
      result.push(`\nexport enum ${GetEnumConstantCase(schema, prop)} {
${_OptionsToEnum(prop.enumOptions)}}`);
      return result;
    } else {
      return result;
    }
  }, []);
  if (codes.length > 0) {
    return codes.join('\n');
  } else {
    return '';
  }
}

function _OptionsToEnum(enumOptions: string[]) {
  const result = enumOptions.map((op: string) => {
    return `${KebabToConstantCase(op)} = '${KebabToConstantCase(op)}',`;
  });
  if (result.length > 0) {
    return result.join('\n');
  } else {
    return '';
  }
}

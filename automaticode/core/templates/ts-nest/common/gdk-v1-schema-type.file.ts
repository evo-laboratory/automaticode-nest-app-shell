import {
  CREATED_AT_PROP_NAME,
  DURATION_END_SUFFIX,
  DURATION_START_SUFFIX,
  SOFT_DELETE_PROP_NAME,
  UPDATED_AT_PROP_NAME,
} from '../../../types/generator.static';
import {
  GDKSchemaProperty,
  GDK_PROPERTY_TYPE,
  IProcessedGDKSchema,
} from '../../../types/generator.type';
import { KebabToCamelCase } from '../../../utils/help';
import { ResolveStaticEnumImports } from '../../../utils/importers';
import { GetPropTypescriptAnnotation } from '../../../utils/transformers';

export const TYPE_SUFFIX_NAME = 'type';

export default function GDKV1SchemaTypeFile(schema: IProcessedGDKSchema) {
  return `${ResolveStaticEnumImports(schema)}

export interface ${schema.interfaceName} {
  ${_FillInFields(schema)}
}

${_CreateFullDto(schema)}
${_UpdateFullDto(schema)}
`;
}

function _FillInFields(schema: IProcessedGDKSchema) {
  const codes = schema.properties.map((prop) => {
    return _PropToFields(schema, prop);
  });
  if (schema.includeCreatedAt) {
    codes.push(_PropToFields(schema, _CreatedAtProp()));
  }
  if (schema.includeUpdatedAt) {
    codes.push(_PropToFields(schema, _UpdatedAtProp()));
  }
  if (schema.enableSoftDelete) {
    codes.push(_PropToFields(schema, _SoftDeleteProp()));
  }
  return codes.join('\n  ');
}

function _PropToFields(
  schema: IProcessedGDKSchema,
  prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>,
): string {
  if (prop.type === GDK_PROPERTY_TYPE.DURATION) {
    return `${KebabToCamelCase(prop.name)}${DURATION_START_SUFFIX}: number;
    ${KebabToCamelCase(prop.name)}${DURATION_END_SUFFIX}: number`;
  } else {
    return `${KebabToCamelCase(prop.name)}: ${GetPropTypescriptAnnotation(
      schema,
      prop,
    )};`;
  }
}

function _CreateFullDto(schema: IProcessedGDKSchema) {
  const omitPropNames = [];
  if (schema.includeCreatedAt) {
    omitPropNames.push(CREATED_AT_PROP_NAME);
  }
  if (schema.includeUpdatedAt) {
    omitPropNames.push(UPDATED_AT_PROP_NAME);
  }
  if (schema.enableSoftDelete) {
    omitPropNames.push(SOFT_DELETE_PROP_NAME);
  }
  if (omitPropNames.length === 0) {
    return `export type ${schema.createFullDtoInterfaceName} = ${schema.interfaceName}`;
  } else {
    return `export type ${schema.createFullDtoInterfaceName} = Omit<${
      schema.interfaceName
    },${omitPropNames.map((p) => `'${KebabToCamelCase(p)}'\n`).join('|')}>;`;
  }
}

function _UpdateFullDto(schema: IProcessedGDKSchema) {
  return `export type ${schema.updateFullDtoInterfaceName} = ${schema.createFullDtoInterfaceName};`;
}

function _CreatedAtProp(): GDKSchemaProperty<GDK_PROPERTY_TYPE> {
  return {
    name: CREATED_AT_PROP_NAME,
    alias: '',
    descriptionNote: 'includedCreatedAt',
    type: GDK_PROPERTY_TYPE.TIMESTAMP,
    default: null,
    isRequired: false,
    isUnique: false,
    isEnableMongoIndex: false,
    referenceSchemaName: '',
    enumOptions: [],
  };
}

function _UpdatedAtProp(): GDKSchemaProperty<GDK_PROPERTY_TYPE> {
  return {
    name: UPDATED_AT_PROP_NAME,
    alias: '',
    descriptionNote: 'includedUpdatedAt',
    type: GDK_PROPERTY_TYPE.TIMESTAMP,
    default: null,
    isRequired: false,
    isUnique: false,
    isEnableMongoIndex: false,
    referenceSchemaName: '',
    enumOptions: [],
  };
}

function _SoftDeleteProp(): GDKSchemaProperty<GDK_PROPERTY_TYPE> {
  return {
    name: SOFT_DELETE_PROP_NAME,
    alias: '',
    descriptionNote: 'enableSoftDeleted',
    type: GDK_PROPERTY_TYPE.BOOLEAN,
    default: false,
    isRequired: false,
    isUnique: false,
    isEnableMongoIndex: false,
    referenceSchemaName: '',
    enumOptions: [],
  };
}

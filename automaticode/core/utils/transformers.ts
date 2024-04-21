import { CONTROLLER_SUFFIX_NAME } from '../templates/ts-nest/common/gdk-v1-controller.file';
import { MODULE_SUFFIX_NAME } from '../templates/ts-nest/common/gdk-v1-module.file';
import {
  CREATE_DTO_PREFIX,
  DTO_SUFFIX,
  UPDATE_FULL_DTO_PREFIX,
} from '../templates/ts-nest/common/gdk-v1-schema-create-dto.file';
import { STATIC_SUFFIX_NAME } from '../templates/ts-nest/common/gdk-v1-schema-static.file';
import { TYPE_SUFFIX_NAME } from '../templates/ts-nest/common/gdk-v1-schema-type.file';
import { SCHEMA_SUFFIX_NAME } from '../templates/ts-nest/mongodb/gdk-v1-mongoose-schema.file';
import { SERVICE_SUFFIX_NAME } from '../templates/ts-nest/mongodb/gdk-v1-mongoose-service.file';
import {
  DURATION_END_SUFFIX,
  DURATION_START_SUFFIX,
} from '../types/generator.static';
import {
  GDKSchema,
  GDKSchemaProperty,
  GDK_PROPERTY_TYPE,
  IProcessedGDKSchema,
} from '../types/generator.type';
import {
  KebabToCamelCase,
  KebabToConstantCase,
  KebabToPascalCase,
} from './help';

export function ProcessGDKSchemaJSONFile(
  schema: GDKSchema<GDK_PROPERTY_TYPE>,
): IProcessedGDKSchema {
  const REF_PROP_TYPES: GDK_PROPERTY_TYPE[] = [
    GDK_PROPERTY_TYPE.REFERENCE_ID,
    GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY,
    GDK_PROPERTY_TYPE.REFERENCE_USER_ID,
  ];
  const kebabCaseName = schema.name;
  const camelCaseName = KebabToCamelCase(kebabCaseName);
  const pascalCaseName = KebabToPascalCase(kebabCaseName);
  const constantCaseName = KebabToConstantCase(kebabCaseName);
  const apiConstantPathName = `${constantCaseName}_API`;
  const apiConstantPath = kebabCaseName;
  const schemaFileName = `${kebabCaseName}.${SCHEMA_SUFFIX_NAME}`;
  const staticFileName = `${kebabCaseName}.${STATIC_SUFFIX_NAME}`;
  const typeFileName = `${kebabCaseName}.${TYPE_SUFFIX_NAME}`;
  const serviceFileName = `${kebabCaseName}.${SERVICE_SUFFIX_NAME}`;
  const controllerFileName = `${kebabCaseName}.${CONTROLLER_SUFFIX_NAME}`;
  const moduleFileName = `${kebabCaseName}.${MODULE_SUFFIX_NAME}`;
  const createDtoFileName = `${CREATE_DTO_PREFIX}${kebabCaseName}.${DTO_SUFFIX}`;
  const updateFullDtoFileName = `${UPDATE_FULL_DTO_PREFIX}${kebabCaseName}.${DTO_SUFFIX}`;
  const hasMongoIndex = schema.properties.some((p) => p.isEnableMongoIndex);
  const hasMongoRefProp = schema.properties.some((p) =>
    REF_PROP_TYPES.includes(p.type),
  );
  const hasEnumOptions = schema.properties.some(
    (p) => p.type === GDK_PROPERTY_TYPE.ENUM_OPTION,
  );
  const createDtoName = `Create${pascalCaseName}FullDto`;
  const updateDtoName = `Update${pascalCaseName}FullDto`;
  return {
    ...schema,
    hasMongoIndex: hasMongoIndex,
    hasMongoRefProp: hasMongoRefProp,
    hasEnumOptions: hasEnumOptions,
    kebabCaseName: kebabCaseName,
    camelCaseName: camelCaseName,
    pascalCaseName: pascalCaseName,
    interfaceName: `I${pascalCaseName}`,
    constantCaseName: constantCaseName,
    apiConstantPathName: apiConstantPathName,
    apiConstantPath: apiConstantPath,
    staticFileName: staticFileName,
    typeFileName: typeFileName,
    serviceFileName: serviceFileName,
    controllerFileName: controllerFileName,
    moduleFileName: moduleFileName,
    createDtoFileName: createDtoFileName,
    updateFullDtoFileName: updateFullDtoFileName,
    mongoModelName: `${GetMongoModelName(kebabCaseName)}`,
    mongoModelRefName: `${GetMongoModelRefName(kebabCaseName)}`,
    mongoDocumentRefName: `${GetMongoModelDocumentRefName(kebabCaseName)}`,
    mongoSchemaRefName: `${GetMongoModelSchemaRefName(kebabCaseName)}`,
    createFullDtoName: createDtoName,
    updateFullDtoName: updateDtoName,
    createFullDtoInterfaceName: `I${createDtoName}`,
    updateFullDtoInterfaceName: `I${updateDtoName}`,
    serviceName: `${pascalCaseName}Service`,
    controllerName: `${pascalCaseName}Controller`,
    schemaFileName: schemaFileName,
    moduleName: `${pascalCaseName}Module`,
  };
}

export function GetPropMongoType(
  schema: IProcessedGDKSchema,
  prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>,
) {
  let type = 'String';
  switch (prop.type) {
    case GDK_PROPERTY_TYPE.STRING:
      type = 'String';
      break;
    case GDK_PROPERTY_TYPE.NUMBER:
      type = 'Number';
      break;
    case GDK_PROPERTY_TYPE.BOOLEAN:
      type = 'Boolean';
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
      type = 'mongoose.Schema.Types.ObjectId';
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_ID:
      type = 'mongoose.Schema.Types.ObjectId';
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY:
      type = '[mongoose.Schema.Types.ObjectId]';
      break;
    case GDK_PROPERTY_TYPE.TIMESTAMP:
      type = 'Number';
      break;
    case GDK_PROPERTY_TYPE.DURATION:
      type = 'Number';
      break;
    case GDK_PROPERTY_TYPE.ENUM_OPTION:
      type = `String`;
      break;
    case GDK_PROPERTY_TYPE.STRING_ARRAY:
      type = '[String]';
      break;
    case GDK_PROPERTY_TYPE.NUMBER_ARRAY:
      type = '[Number]';
      break;
    case GDK_PROPERTY_TYPE.BOOLEAN_ARRAY:
      type = '[Boolean]';
      break;
    case GDK_PROPERTY_TYPE.OBJECT:
      type = 'mongoose.Schema.Types.Mixed';
      break;
    case GDK_PROPERTY_TYPE.EMAIL:
      type = 'String';
      break;
    case GDK_PROPERTY_TYPE.IMAGE_URL:
      type = 'String';
      break;
    case GDK_PROPERTY_TYPE.IMAGE_URL_ARRAY:
      type = '[String]';
      break;
    case GDK_PROPERTY_TYPE.QUILL_RICH_TEXT_EDITOR:
      type = 'mongoose.Schema.Types.Mixed';
      break;
    default:
      break;
  }
  return type;
}

export function GetPropMongoDefault(
  schema: IProcessedGDKSchema,
  prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>,
) {
  let defaultValue: any = null;
  switch (prop.type) {
    case GDK_PROPERTY_TYPE.STRING:
      defaultValue = prop.default ? `${prop.default}` : `''`;
      break;
    case GDK_PROPERTY_TYPE.NUMBER:
      defaultValue = prop.default ? Number(prop.default) : 0;
      break;
    case GDK_PROPERTY_TYPE.BOOLEAN:
      defaultValue = ParseAnyToBoolean(prop.default);
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
      defaultValue = null;
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_ID:
      defaultValue = null;
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY:
      defaultValue = `[]`;
      break;
    case GDK_PROPERTY_TYPE.TIMESTAMP:
      defaultValue = Number(prop.default) || 0;
      break;
    case GDK_PROPERTY_TYPE.DURATION:
      defaultValue = Number(prop.default) || 0;
      break;
    case GDK_PROPERTY_TYPE.ENUM_OPTION:
      defaultValue = prop.default
        ? `${KebabToConstantCase(schema.name)}_${KebabToConstantCase(
            prop.name,
          )}.${KebabToConstantCase(prop.default)}`
        : null;
      break;
    case GDK_PROPERTY_TYPE.STRING_ARRAY:
      defaultValue = `[]`;
      break;
    case GDK_PROPERTY_TYPE.NUMBER_ARRAY:
      defaultValue = `[]`;
      break;
    case GDK_PROPERTY_TYPE.BOOLEAN_ARRAY:
      defaultValue = `[]`;
      break;
    case GDK_PROPERTY_TYPE.OBJECT:
      defaultValue = `{}`;
      break;
    case GDK_PROPERTY_TYPE.EMAIL:
      defaultValue = null;
      break;
    case GDK_PROPERTY_TYPE.IMAGE_URL:
      defaultValue = null;
      break;
    case GDK_PROPERTY_TYPE.IMAGE_URL_ARRAY:
      defaultValue = `[]`;
      break;
    case GDK_PROPERTY_TYPE.QUILL_RICH_TEXT_EDITOR:
      defaultValue = `{}`;
      break;
    default:
      break;
  }
  return `${defaultValue}`;
}

export function GetPropTypescriptAnnotation(
  schema: IProcessedGDKSchema,
  prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>,
) {
  let annotation = 'any';
  switch (prop.type) {
    case GDK_PROPERTY_TYPE.STRING:
      annotation = 'string';
      break;
    case GDK_PROPERTY_TYPE.NUMBER:
      annotation = 'number';
      break;
    case GDK_PROPERTY_TYPE.BOOLEAN:
      annotation = 'boolean';
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
      annotation = 'any';
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_ID:
      annotation = 'any';
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY:
      annotation = 'any[]';
      break;
    case GDK_PROPERTY_TYPE.TIMESTAMP:
      annotation = 'number';
      break;
    case GDK_PROPERTY_TYPE.DURATION:
      annotation = 'number';
      break;
    case GDK_PROPERTY_TYPE.ENUM_OPTION:
      annotation = `${GetEnumConstantCase(schema, prop)}`;
      break;
    case GDK_PROPERTY_TYPE.STRING_ARRAY:
      annotation = 'string[]';
      break;
    case GDK_PROPERTY_TYPE.NUMBER_ARRAY:
      annotation = 'number[]';
      break;
    case GDK_PROPERTY_TYPE.BOOLEAN_ARRAY:
      annotation = 'boolean[]';
      break;
    case GDK_PROPERTY_TYPE.OBJECT:
      annotation = 'any';
      break;
    case GDK_PROPERTY_TYPE.EMAIL:
      annotation = 'string';
      break;
    case GDK_PROPERTY_TYPE.IMAGE_URL:
      annotation = 'string';
      break;
    case GDK_PROPERTY_TYPE.IMAGE_URL_ARRAY:
      annotation = 'string[]';
      break;
    case GDK_PROPERTY_TYPE.QUILL_RICH_TEXT_EDITOR:
      annotation = 'any';
      break;
    default:
      break;
  }
  return annotation;
}

export function PropsToDtoProps(schema: IProcessedGDKSchema) {
  const props = schema.properties.reduce((allDtoProps: string[], prop) => {
    const transformedCodes: string[] = _PropToDtoProp(schema, prop);
    return allDtoProps.concat(transformedCodes);
  }, []);
  return props.join('\n');
}

function _PropToDtoProp(
  schema: IProcessedGDKSchema,
  prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>,
): string[] {
  const classValidators = [];
  switch (prop.type) {
    case GDK_PROPERTY_TYPE.STRING:
      classValidators.push(`@IsString()`);
      break;
    case GDK_PROPERTY_TYPE.NUMBER:
      classValidators.push(`@IsNumber()`);
      break;
    case GDK_PROPERTY_TYPE.BOOLEAN:
      classValidators.push(`@IsBoolean()`);
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
      classValidators.push(`@IsString()`);
      classValidators.push(`@ValidateIf((object, value) => value !== null)`);
      break;
    case GDK_PROPERTY_TYPE.REFERENCE_ID:
      classValidators.push(`@IsString()`);
      classValidators.push(`@ValidateIf((object, value) => value !== null)`);
      break;
    case GDK_PROPERTY_TYPE.DATE:
      classValidators.push(`@IsNumber()`);
      break;
    case GDK_PROPERTY_TYPE.TIMESTAMP:
      classValidators.push(`@IsNumber()`);
      break;
    case GDK_PROPERTY_TYPE.DURATION:
      classValidators.push(`@IsNumber()`);
      classValidators.push(
        `${KebabToCamelCase(
          prop.name,
        )}${DURATION_START_SUFFIX}: ${GetPropTypescriptAnnotation(
          schema,
          prop,
        )}\n`,
      );
      classValidators.push(`@IsNumber()`);
      classValidators.push(
        `${KebabToCamelCase(
          prop.name,
        )}${DURATION_END_SUFFIX}: ${GetPropTypescriptAnnotation(
          schema,
          prop,
        )}\n`,
      );
      break;
    case GDK_PROPERTY_TYPE.ENUM_OPTION:
      classValidators.push(`@IsString()`);
      classValidators.push(`@IsNotEmpty()`);
      classValidators.push(
        `@IsEnum(${GetEnumConstantCase(schema, prop)}, { each: true })`,
      );
      break;
    case GDK_PROPERTY_TYPE.EMAIL:
      classValidators.push(`@IsString()`);
      classValidators.push(`@IsEmail()`);
      break;
    case GDK_PROPERTY_TYPE.IMAGE_URL:
      classValidators.push(`@IsString()`);
    default:
      break;
  }
  if (prop.isRequired) {
    classValidators.push('@IsNotEmpty()');
  }
  if (prop.type !== GDK_PROPERTY_TYPE.DURATION) {
    // * Already handled in above switch block
    classValidators.push(
      `${KebabToCamelCase(prop.name)}: ${GetPropTypescriptAnnotation(
        schema,
        prop,
      )}\n`,
    );
  }

  return classValidators;
}

export function ParseAnyToBoolean(input: any): boolean {
  const inputText = `${input}`.toUpperCase();
  const TRUE_VARIANTS = ['TRUE', 'T'];
  const FALSE_VARIANTS = ['FALSE', 'F'];
  if (TRUE_VARIANTS.includes(inputText)) {
    return true;
  } else if (FALSE_VARIANTS.includes(inputText)) {
    return false;
  } else {
    return false;
  }
}

export function GetEnumConstantCase(
  schema: IProcessedGDKSchema,
  prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>,
): string {
  return `${schema.constantCaseName}_${KebabToConstantCase(prop.name)}`;
}

export function GetMongoModelName(name: string) {
  return `${KebabToConstantCase(name)}_MODEL_NAME`;
}

export function GetMongoModelRefName(name: string) {
  return `${KebabToPascalCase(name)}Model`;
}

export function GetMongoModelDocumentRefName(name: string) {
  return `${KebabToPascalCase(name)}Document`;
}

export function GetMongoModelSchemaRefName(name: string) {
  return `${KebabToPascalCase(name)}Schema`;
}

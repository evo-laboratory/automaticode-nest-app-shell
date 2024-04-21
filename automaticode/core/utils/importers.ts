import { STATIC_SUFFIX_NAME } from '../templates/ts-nest/common/gdk-v1-schema-static.file';
import { IMPORT_GDK } from '../types/generator.static';
import {
  GDK_PROPERTY_TYPE,
  IProcessedGDKSchema,
} from '../types/generator.type';
import { KebabToConstantCase } from './help';
import { GetMongoModelName } from './transformers';

export function ResolveStaticEnumImports(schema: IProcessedGDKSchema) {
  // ! Use SchemaStaticImporter, deprecate this
  // * Enum Imports
  const enumProps = schema.properties
    .filter((prop) => prop.type === GDK_PROPERTY_TYPE.ENUM_OPTION)
    .map((enumProp) => {
      return `${schema.constantCaseName}_${KebabToConstantCase(
        enumProp.name,
      )},`;
    });
  if (enumProps.length > 0) {
    return `import { ${enumProps.join('\n')}
      } from '@gdk/${schema.kebabCaseName}/${
      schema.kebabCaseName
    }.${STATIC_SUFFIX_NAME}';`;
  } else {
    return '';
  }
}

export function ResolveReferenceImports(schema: IProcessedGDKSchema) {
  const imports = [];
  const hasUserRefProps = schema.properties.filter(
    (prop) => prop.type === GDK_PROPERTY_TYPE.REFERENCE_USER_ID,
  );
  const hasRefProps = schema.properties.filter(
    (prop) =>
      prop.type === GDK_PROPERTY_TYPE.REFERENCE_ID ||
      prop.type === GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY,
  );
  if (hasUserRefProps.length > 0) {
    imports.push(`import { USER_MODEL_NAME } from '@gdk/user/user.static';`);
  }
  if (hasRefProps.length > 0) {
    hasRefProps.forEach((prop) => {
      imports.push(
        `import { ${GetMongoModelName(prop.referenceSchemaName)} } from '@gdk/${
          prop.referenceSchemaName
        }/${prop.referenceSchemaName}.${STATIC_SUFFIX_NAME}';`,
      );
    });
  }
  return imports.join('\n');
}

export function ResolveClassValidatorsImport(schema: IProcessedGDKSchema) {
  const usingValidatorNames = new Set<string>([]);
  schema.properties.forEach((p) => {
    switch (p.type) {
      case GDK_PROPERTY_TYPE.STRING:
        usingValidatorNames.add('IsString');
        break;
      case GDK_PROPERTY_TYPE.NUMBER:
        usingValidatorNames.add('IsNumber');
        break;
      case GDK_PROPERTY_TYPE.BOOLEAN:
        usingValidatorNames.add('IsBoolean');
      case GDK_PROPERTY_TYPE.REFERENCE_ID:
        usingValidatorNames.add('IsString');
        usingValidatorNames.add('ValidateIf');
        break;
      case GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
        usingValidatorNames.add('IsString');
        usingValidatorNames.add('ValidateIf');
        break;
      case GDK_PROPERTY_TYPE.DATE:
        usingValidatorNames.add('IsNumber');
        break;
      case GDK_PROPERTY_TYPE.TIMESTAMP:
        usingValidatorNames.add('IsNumber');
        break;
      case GDK_PROPERTY_TYPE.DURATION:
        usingValidatorNames.add('IsNumber');
        break;
      case GDK_PROPERTY_TYPE.ENUM_OPTION:
        usingValidatorNames.add('IsString');
        usingValidatorNames.add('IsEnum');
        usingValidatorNames.add('IsNotEmpty');
        break;
      case GDK_PROPERTY_TYPE.EMAIL:
        usingValidatorNames.add('IsString');
        usingValidatorNames.add('IsEmail');
      case GDK_PROPERTY_TYPE.IMAGE_URL:
        usingValidatorNames.add('IsString');
        break;
      default:
        break;
    }
    if (p.isRequired) {
      usingValidatorNames.add('IsNotEmpty');
    }
  });
  const arrayOfValidators = Array.from(usingValidatorNames);
  return `import { ${arrayOfValidators.join(',\n')} } from 'class-validator';
`;
}

export function SchemaStaticImporter(
  schema: IProcessedGDKSchema,
  { enableAPI = true, enableMongoModel = true, enableEnum = true },
) {
  if (!enableAPI && !enableEnum) {
    return '';
  }
  const exportItems = [];
  if (enableAPI) {
    exportItems.push(schema.apiConstantPathName);
  }
  if (enableMongoModel) {
    exportItems.push(schema.mongoModelName);
  }
  if (enableEnum) {
    schema.properties.forEach((prop) => {
      if (prop.type === GDK_PROPERTY_TYPE.ENUM_OPTION) {
        exportItems.push(
          `${schema.constantCaseName}_${KebabToConstantCase(prop.name)}`,
        );
      }
    });
  }
  return `import { ${exportItems.join(',\n')} } from '${IMPORT_GDK}/${
    schema.kebabCaseName
  }/${schema.staticFileName}';
`;
}

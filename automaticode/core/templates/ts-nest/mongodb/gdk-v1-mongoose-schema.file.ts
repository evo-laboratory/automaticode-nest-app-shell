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
import {
  ResolveReferenceImports,
  ResolveStaticEnumImports,
} from '../../../utils/importers';
import {
  GetEnumConstantCase,
  GetMongoModelName,
  GetPropMongoDefault,
  GetPropMongoType,
  GetPropTypescriptAnnotation,
} from '../../../utils/transformers';

export const SCHEMA_SUFFIX_NAME = 'schema';

export default function GDKV1TSNestMongooseSchemaFile(
  schema: IProcessedGDKSchema,
) {
  return `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { MongoModelBuilder } from '@shared/mongodb/mongodb-model-builder';
${_ResolveFileImports(schema)}
${ResolveReferenceImports(schema)}

${ResolveStaticEnumImports(schema)}
import { ${schema.interfaceName} } from '@gdk/${schema.kebabCaseName}/${
    schema.kebabCaseName
  }.type';

import { ${schema.mongoModelName} } from '@gdk/${schema.kebabCaseName}/${
    schema.kebabCaseName
  }.static';

export type ${schema.pascalCaseName}Document = HydratedDocument<${
    schema.pascalCaseName
  }>;

@Schema()
export class ${schema.pascalCaseName} implements ${schema.interfaceName} {
  ${_GenerateProps(schema)}
}

export const ${schema.mongoSchemaRefName} =
  SchemaFactory.createForClass(${schema.pascalCaseName});
${schema.hasMongoIndex ? _ResolvePropSingleIndex(schema) : ''}
export const ${schema.mongoModelRefName} = MongoModelBuilder(
  ${schema.mongoModelName},
  ${schema.mongoSchemaRefName},
);
`;
}

function _GenerateProps(schema: IProcessedGDKSchema) {
  const codes = schema.properties.map((prop) => {
    return _GDKPropToSchemaProp(schema, prop);
  });
  if (schema.includeCreatedAt) {
    codes.push(`@Prop({ type: Number, default: Date.now()})
    ${KebabToCamelCase(CREATED_AT_PROP_NAME)}: number`);
  }
  if (schema.includeCreatedAt) {
    codes.push(`@Prop({ type: Number, default: Date.now()})
    ${KebabToCamelCase(UPDATED_AT_PROP_NAME)}: number`);
  }
  if (schema.enableSoftDelete) {
    codes.push(`@Prop({ type: Boolean, default: false})
    ${KebabToCamelCase(SOFT_DELETE_PROP_NAME)}: boolean`);
  }
  return codes.join('\n\n');
}

function _GDKPropToSchemaProp(
  schema: IProcessedGDKSchema,
  prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>,
) {
  if (prop.type === GDK_PROPERTY_TYPE.DURATION) {
    return `@Prop({ type: Number, default: null })
    ${KebabToCamelCase(prop.name)}${DURATION_START_SUFFIX}: number;

    @Prop({ type: Number, default: null })
    ${KebabToCamelCase(prop.name)}${DURATION_END_SUFFIX}: number;`;
  } else {
    return `@Prop({${_RenderPropContent(schema, prop)}})
    ${KebabToCamelCase(prop.name)}: ${GetPropTypescriptAnnotation(
      schema,
      prop,
    )};`;
  }
}

function _RenderPropContent(
  schema: IProcessedGDKSchema,
  prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>,
) {
  const contents = [
    `type: ${GetPropMongoType(schema, prop)},`,
    `default: ${GetPropMongoDefault(schema, prop)},`,
    `required: ${prop.isRequired ? true : false},`,
  ];
  if (prop.type === GDK_PROPERTY_TYPE.ENUM_OPTION) {
    contents.push(`enum: EnumToArray(${GetEnumConstantCase(schema, prop)}),`);
  }
  if (prop.type === GDK_PROPERTY_TYPE.REFERENCE_USER_ID) {
    contents.push(`ref: USER_MODEL_NAME,`);
  }
  if (prop.type === GDK_PROPERTY_TYPE.REFERENCE_ID) {
    contents.push(`ref: ${GetMongoModelName(prop.referenceSchemaName)},`);
  }
  if (prop.isUnique || prop.type === GDK_PROPERTY_TYPE.EMAIL) {
    contents.push('unique: true');
  }
  return contents.join('\n');
}

function _ResolveFileImports(schema: IProcessedGDKSchema) {
  const importCodes = [];
  const hasRefIdProps = schema.properties.filter(
    (p) =>
      p.type === GDK_PROPERTY_TYPE.REFERENCE_ID ||
      p.type === GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY ||
      p.type === GDK_PROPERTY_TYPE.REFERENCE_USER_ID,
  );
  const hasEnumProps = schema.properties.filter(
    (p) => p.type === GDK_PROPERTY_TYPE.ENUM_OPTION,
  );
  if (hasRefIdProps.length > 0) {
    importCodes.push(`import mongoose from 'mongoose';`);
  }
  if (hasEnumProps.length > 0) {
    importCodes.push(`import { EnumToArray } from '@shared/helper/helper';`);
  }
  if (importCodes.length > 0) {
    return importCodes.join('\n');
  } else {
    return '';
  }
}

function _ResolvePropSingleIndex(schema: IProcessedGDKSchema) {
  const createIndexCodes = schema.properties.reduce((all: string[], prop) => {
    if (prop.isEnableMongoIndex && prop.type !== GDK_PROPERTY_TYPE.DURATION) {
      all.push(
        `${schema.mongoSchemaRefName}.index({ ${KebabToCamelCase(
          prop.name,
        )}: 1 })`,
      );
    }
    return all;
  }, []);
  if (schema.enableSoftDelete) {
    createIndexCodes.push(
      `${schema.mongoSchemaRefName}.index({ ${KebabToCamelCase(
        SOFT_DELETE_PROP_NAME,
      )}: 1})`,
    );
  }
  if (createIndexCodes.length > 0) {
    return createIndexCodes.join('\n');
  } else {
    return '';
  }
}

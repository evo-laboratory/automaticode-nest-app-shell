import {
  CREATE_METHOD,
  DELETE_BY_ID_METHOD,
  DURATION_END_SUFFIX,
  DURATION_START_SUFFIX,
  GET_BY_ID_METHOD,
  LIST_ALL_METHOD,
  LIST_BY_UNIQUE_METHOD,
  SOFT_DELETE_METHOD,
  SOFT_DELETE_PROP_NAME,
  UPDATED_AT_PROP_NAME,
  UPDATE_FULL_METHOD,
} from '../../../types/generator.static';
import {
  GDKSchemaProperty,
  GDK_PROPERTY_TYPE,
  IProcessedGDKSchema,
} from '../../../types/generator.type';
import {
  KebabToCamelCase,
  KebabToConstantCase,
  KebabToPascalCase,
} from '../../../utils/help';
import { GetPropTypescriptAnnotation } from '../../../utils/transformers';
import { STATIC_SUFFIX_NAME } from '../common/gdk-v1-schema-static.file';
import { TYPE_SUFFIX_NAME } from '../common/gdk-v1-schema-type.file';
import { SCHEMA_SUFFIX_NAME } from './gdk-v1-mongoose-schema.file';

export const SERVICE_SUFFIX_NAME = 'service';
export default function GDKV1TSNestMongooseServiceFile(
  schema: IProcessedGDKSchema,
) {
  return `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { ${schema.pascalCaseName}, ${
    schema.pascalCaseName
  }Document } from '@gdk/${schema.kebabCaseName}/${
    schema.kebabCaseName
  }.${SCHEMA_SUFFIX_NAME}'; 
${_ResolveStaticImports(schema)}
import { ${schema.interfaceName}, ${schema.createFullDtoInterfaceName}, ${
    schema.updateFullDtoInterfaceName
  } } from '@gdk/${schema.kebabCaseName}/${
    schema.kebabCaseName
  }.${TYPE_SUFFIX_NAME}';

import { MongoDBErrorHandler } from '@shared/mongodb/mongodb-error-handler';
import { MethodLogger } from '@shared/loggers/method-logger.decorator';

@Injectable()
export class ${schema.serviceName} {
  constructor(
    @InjectModel(${schema.mongoModelName})
    private readonly ${schema.mongoModelRefName}: Model<${
    schema.pascalCaseName
  }>,
  ) {}

  // * === [ C ] CREATE ===========

  ${_CreateFullMethod(schema)}

  // * === [ R ] READ =============

  ${_GetByIdMethod(schema)}

  ${_GenerateGetOneUniqueMethods(schema)}

  ${_ListAllMethod(schema)}

  ${_GenerateListByIndexMethods(schema)}

  ${_GenerateListByEnumOptionsMethods(schema)}

  // * === [ U ] UPDATE ===========

  ${_UpdateFullMethod(schema)}

  // * === [ D ] DELETE ===========

  ${_SoftDeleteMethod(schema)}

  ${_DeleteMethod(schema)}

}
`;
}

function _CreateFullMethod(schema: IProcessedGDKSchema) {
  return `@MethodLogger()
  public async ${CREATE_METHOD}(
    dto: ${schema.createFullDtoInterfaceName},
    session?: ClientSession,
  ): Promise<${schema.mongoDocumentRefName}> {
    try {
      const newData: ${schema.mongoDocumentRefName} = await new this.${
    schema.mongoModelRefName
  }({
        ${_PropToDto(schema)}
      }).save({ session: session });
      return newData;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }
`;
}

function _GetByIdMethod(schema: IProcessedGDKSchema) {
  return `@MethodLogger()
  public async ${GET_BY_ID_METHOD}(
    id: string,
    ${schema.hasMongoRefProp ? 'populateAll = false,' : ''}
  ): Promise<${schema.mongoDocumentRefName}> {
    try {
      const data = await this.${schema.mongoModelRefName}.findById(id);
      ${
        schema.hasMongoRefProp
          ? `if (populateAll) { 
            await data.populate(${_getAllPopulateProps(schema)}); 
          }`
          : ''
      }
      return data;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }
`;
}

function _GenerateGetOneUniqueMethods(schema: IProcessedGDKSchema) {
  const codes = schema.properties.reduce((allCodes: string[], prop) => {
    if (prop.isUnique) {
      allCodes.push(`@MethodLogger()
  public async getBy${KebabToPascalCase(prop.name)}(
    ${KebabToCamelCase(prop.name)}: ${GetPropTypescriptAnnotation(
        schema,
        prop,
      )},
      ${schema.hasMongoRefProp ? 'populateAll = false,' : ''}
  ): Promise<${schema.mongoDocumentRefName}> {
    try {
      const data = await this.${schema.mongoModelRefName}.findOne({
        ${KebabToCamelCase(prop.name)}: ${KebabToCamelCase(prop.name)}
      });
      ${
        schema.hasMongoRefProp
          ? `if (populateAll) { 
            await data.populate(${_getAllPopulateProps(schema)}); 
          }`
          : ''
      }
      return data;
    } catch(error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }    
      `);
    }
    return allCodes;
  }, []);
  if (codes.length > 0) {
    return codes.join('\n');
  } else {
    return '';
  }
}

function _ListAllMethod(schema: IProcessedGDKSchema) {
  return `@MethodLogger()
  public async ${LIST_ALL_METHOD}(${
    schema.hasMongoRefProp ? 'populateAll = false,' : ''
  }): Promise<${schema.interfaceName}[]> {
    try {
      const dataList = await this.${schema.mongoModelRefName}.find().lean();
      ${
        schema.hasMongoRefProp
          ? `if (populateAll) { 
            await this.${
              schema.mongoModelRefName
            }.populate(dataList, { path: '${_getAllPopulateProps(
              schema,
              true,
            )}' });
          }`
          : ''
      }
      return dataList;
    } catch(error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }
`;
}

function _GenerateListByIndexMethods(schema: IProcessedGDKSchema) {
  const STRING_PROPS: GDK_PROPERTY_TYPE[] = [
    GDK_PROPERTY_TYPE.EMAIL,
    GDK_PROPERTY_TYPE.STRING,
    GDK_PROPERTY_TYPE.REFERENCE_ID,
    GDK_PROPERTY_TYPE.REFERENCE_USER_ID,
  ];
  const codes: string[] = schema.properties.reduce(
    (allCodes: string[], prop) => {
      if (prop.isEnableMongoIndex && STRING_PROPS.includes(prop.type)) {
        const propCamelName = KebabToCamelCase(prop.name);
        allCodes.push(`@MethodLogger()
      public async ${LIST_BY_UNIQUE_METHOD}${KebabToPascalCase(prop.name)}(
        ${propCamelName} : ${GetPropTypescriptAnnotation(schema, prop)},
        ${schema.hasMongoRefProp ? 'populateAll = false,' : ''}
      ): Promise<${schema.interfaceName}[]> {
        try {
          const dataList = await this.${schema.mongoModelRefName}.find({
            ${propCamelName}: ${propCamelName}
          }).lean();
          ${
            schema.hasMongoRefProp
              ? `if (populateAll) { 
                await this.${
                  schema.mongoModelRefName
                }.populate(dataList, { path: '${_getAllPopulateProps(
                  schema,
                  true,
                )}' });
              }`
              : ''
          }
          return dataList;
        } catch(error) {
          return Promise.reject(MongoDBErrorHandler(error));
        }
      }
    `);
      }
      return allCodes;
    },
    [],
  );
  if (codes.length > 0) {
    return codes.join('\n');
  } else {
    return '';
  }
}

function _GenerateListByEnumOptionsMethods(schema: IProcessedGDKSchema) {
  const codes: string[] = schema.properties.reduce(
    (allCodes: string[], prop) => {
      if (prop.type === GDK_PROPERTY_TYPE.ENUM_OPTION) {
        const propCamelName = KebabToCamelCase(prop.name);
        allCodes.push(`@MethodLogger()
      public async listBy${KebabToPascalCase(prop.name)}(
        ${propCamelName}Options : ${GetPropTypescriptAnnotation(
          schema,
          prop,
        )}[],
        ${schema.hasMongoRefProp ? 'populateAll = false,' : ''}
      ): Promise<${schema.interfaceName}[]> {
        try {
          const dataList = await this.${schema.mongoModelRefName}.find({
            ${propCamelName}: {
              $in: ${propCamelName}Options
            }
          }).lean();
          ${
            schema.hasMongoRefProp
              ? `if (populateAll) { 
                await this.${
                  schema.mongoModelRefName
                }.populate(dataList, { path: '${_getAllPopulateProps(
                  schema,
                  true,
                )}' });
              }`
              : ''
          }
          return dataList;
        } catch(error) {
          return Promise.reject(MongoDBErrorHandler(error));
        }
      }
    `);
      }
      return allCodes;
    },
    [],
  );
  if (codes.length > 0) {
    return codes.join('\n');
  } else {
    return '';
  }
}

function _UpdateFullMethod(schema: IProcessedGDKSchema) {
  return `@MethodLogger()
  public async ${UPDATE_FULL_METHOD}(
    id: string,
    dto: ${schema.updateFullDtoInterfaceName},
    session?: ClientSession,
    returnNew?: boolean
  ): Promise<${schema.mongoDocumentRefName}> {
    try {
      const updatedData: ${schema.mongoDocumentRefName} = await this.${
    schema.mongoModelRefName
  }.findByIdAndUpdate(
        id,
        {
          ${_PropToDto(schema, true)}
        },
        { new: returnNew ? true : false , session: session }
      );
      return updatedData;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }
`;
}

function _SoftDeleteMethod(schema: IProcessedGDKSchema) {
  return `@MethodLogger()
  public async ${SOFT_DELETE_METHOD}(
    id: string,
    dto: ${schema.updateFullDtoInterfaceName},
    session?: ClientSession,
    returnNew?: boolean
  ): Promise<${schema.mongoDocumentRefName}> {
    try {
      const updatedData: ${schema.mongoDocumentRefName} = await this.${
    schema.mongoModelRefName
  }.findByIdAndUpdate(
        id,
        {
          ${KebabToCamelCase(SOFT_DELETE_PROP_NAME)}: true,
          ${
            schema.includeUpdatedAt
              ? `${KebabToCamelCase(
                  UPDATED_AT_PROP_NAME,
                )}: new Date().getTime(),`
              : ''
          }
        },
        { new: returnNew ? true : false , session: session }
      );
      return updatedData;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }
`;
}

function _DeleteMethod(schema: IProcessedGDKSchema) {
  return `@MethodLogger()
  public async ${DELETE_BY_ID_METHOD}(
    id: string,
    session?: ClientSession,
  ): Promise<${schema.mongoDocumentRefName}> {
    try {
      const deletedData: ${schema.mongoDocumentRefName} = await this.${schema.mongoModelRefName}.findByIdAndDelete(
        id,
        { session: session }
      );
      return deletedData;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }
`;
}

function _PropToDto(schema: IProcessedGDKSchema, isUpdate = false) {
  const codes = schema.properties.reduce(
    (allCodes: string[], prop: GDKSchemaProperty<GDK_PROPERTY_TYPE>) => {
      const camelName = KebabToCamelCase(prop.name);
      if (prop.type === GDK_PROPERTY_TYPE.DURATION) {
        allCodes.push(
          `${camelName}${DURATION_START_SUFFIX}: dto.${camelName}${DURATION_START_SUFFIX}`,
        );
        allCodes.push(
          `${camelName}${DURATION_END_SUFFIX}: dto.${camelName}${DURATION_END_SUFFIX}`,
        );
      } else {
        allCodes.push(`${camelName}: dto.${camelName}`);
      }
      return allCodes;
    },
    [],
  );
  if (isUpdate && schema.includeUpdatedAt) {
    codes.push(
      `${KebabToCamelCase(UPDATED_AT_PROP_NAME)}: new Date().getTime()`,
    );
  }
  return codes.join(',\n');
}

function _ResolveStaticImports(schema: IProcessedGDKSchema) {
  const importNames = [`${schema.mongoModelName}`];
  const enumProps = schema.properties.filter(
    (prop) => prop.type === GDK_PROPERTY_TYPE.ENUM_OPTION,
  );
  if (enumProps.length > 0) {
    enumProps.forEach((prop) => {
      importNames.push(
        `${schema.constantCaseName}_${KebabToConstantCase(prop.name)}`,
      );
    });
  }
  return `import { ${importNames.join(',')} } from '@gdk/${
    schema.kebabCaseName
  }/${schema.kebabCaseName}.${STATIC_SUFFIX_NAME}'`;
}

function _getAllPopulateProps(
  schema: IProcessedGDKSchema,
  returnPathString = false,
): string {
  const populateNames = schema.properties.reduce(
    (propNames: string[], prop) => {
      if (
        prop.type === GDK_PROPERTY_TYPE.REFERENCE_ID ||
        prop.type === GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY ||
        prop.type === GDK_PROPERTY_TYPE.REFERENCE_USER_ID
      ) {
        if (!returnPathString) {
          propNames.push(`'${KebabToCamelCase(prop.name)}'`);
        } else {
          propNames.push(`${KebabToCamelCase(prop.name)}`);
        }
      }
      return propNames;
    },
    [],
  );
  if (populateNames.length > 0) {
    if (returnPathString) {
      return populateNames.join(' ');
    } else {
      return `[${populateNames.join(',')}]`;
    }
  } else {
    return '';
  }
}

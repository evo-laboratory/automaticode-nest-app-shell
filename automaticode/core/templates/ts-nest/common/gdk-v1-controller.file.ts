import {
  CREATE_METHOD,
  DELETE_BY_ID_METHOD,
  DTOS_FOLDER_NAME,
  GET_BY_ID_METHOD,
  LIST_ALL_METHOD,
  LIST_BY_ENUM_OPTION_METHOD,
  LIST_BY_UNIQUE_METHOD,
  UPDATE_FULL_METHOD,
} from '../../../types/generator.static';
import {
  GDK_PROPERTY_TYPE,
  IProcessedGDKSchema,
} from '../../../types/generator.type';
import {
  FstLetterLowerCase,
  KebabToCamelCase,
  KebabToConstantCase,
  KebabToPascalCase,
} from '../../../utils/help';
import { SchemaStaticImporter } from '../../../utils/importers';
import { GetPropTypescriptAnnotation } from '../../../utils/transformers';

export const CONTROLLER_SUFFIX_NAME = 'controller';
export function GDKV1NestControllerFile(schema: IProcessedGDKSchema) {
  const SERVICE_REF = `${FstLetterLowerCase(schema.serviceName)}`;
  return `import { 
    Controller, Post, Get, Put, Delete, Param, Query, Body,
    ${schema.defaultWriteRoles || schema.defaultReadRoles ? 'UseGuards' : ''} 
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  import { 
    GPI, VER_1, LIST_PATH, 
    ${schema.enableSoftDelete ? 'SOFT_DELETE_PATH,' : ''}
    ${schema.hasMongoRefProp ? 'Q_MONGO_POPULATE_ALL,' : ''}
    ${schema.hasEnumOptions ? 'Q_ENUM_OPTIONS' : ''}
  } from '@shared/types/gdk';
  ${SchemaStaticImporter(schema, { enableMongoModel: false })}

  ${_GuardsImporter(schema)}
  ${_SharedHelperImporter(schema)}

  import { ${schema.serviceName} } from './${schema.serviceFileName}';
  import { ${schema.createFullDtoName}} from './${DTOS_FOLDER_NAME}/${
    schema.createDtoFileName
  }';
  import { ${schema.updateFullDtoName} } from './${DTOS_FOLDER_NAME}/${
    schema.updateFullDtoFileName
  }';

  @ApiTags('${schema.pascalCaseName}')
  @Controller(\`\${GPI}/\${${schema.apiConstantPathName}}\`)
  export class ${schema.controllerName} {
    constructor(private readonly ${SERVICE_REF}: ${schema.serviceName}) {}

  ${_ResolveGuards(schema, false)}
  @Post(\`\${VER_1}\`)
  async create${schema.pascalCaseName}V1(
    @Body() dto: ${schema.createFullDtoName}
  ) {
    return await this.${SERVICE_REF}.${CREATE_METHOD}(dto);
  }

  ${_GenerateListByIndexAPIs(schema)}

  ${_GenerateListByEnumOptionsAPI(schema)}

  ${_ResolveGuards(schema, true)}
  @Get(\`\${VER_1}/\${LIST_PATH}\`)
  async get${schema.pascalCaseName}ListV1(
    ${_PopulateAllQuery(schema)}
  ) {
    ${_PopulateAllParser(schema)}
    return await this.${SERVICE_REF}.${LIST_ALL_METHOD}(${
    schema.hasMongoRefProp ? 'parsedPopulateAllQ' : ''
  });
  }

  ${_ResolveGuards(schema, true)}
  @Get(\`\${VER_1}/:id\`)
  async get${schema.pascalCaseName}ByIdV1(
    @Param('id') id: string,
    ${_PopulateAllQuery(schema)}
  ) {
    ${_PopulateAllParser(schema)}
    return await this.${SERVICE_REF}.${GET_BY_ID_METHOD}(id${_PopulateAllArg(
    schema,
  )});
  }

  ${_ResolveGuards(schema, false)}
  @Put(\`\${VER_1}/:id\`)
  async update${schema.pascalCaseName}ByIdV1(
    @Param('id') id: string,
    @Body() dto: ${schema.updateFullDtoName},
  ) {
    return await this.${SERVICE_REF}.${UPDATE_FULL_METHOD}(id, dto);
  }

  ${_SoftDeleteAPI(schema)}

  ${_ResolveGuards(schema, false)}
  @Delete(\`\${VER_1}/:id\`)
  async delete${schema.pascalCaseName}ByIdV1(
    @Param('id') id: string,
  ) {
    return await this.${SERVICE_REF}.${DELETE_BY_ID_METHOD}(id);
  }
  
}
`;
}

function _PopulateAllQuery(schema: IProcessedGDKSchema) {
  return `${
    schema.hasMongoRefProp
      ? `@Query(\`\${Q_MONGO_POPULATE_ALL}\`) isPopulateAll: string`
      : ''
  }`;
}

function _PopulateAllParser(schema: IProcessedGDKSchema) {
  return `${
    schema.hasMongoRefProp
      ? `const parsedPopulateAllQ = ParseAnyToBoolean(isPopulateAll);`
      : ''
  }`;
}

function _PopulateAllArg(schema: IProcessedGDKSchema, commaPrefix = true) {
  if (commaPrefix) {
    return `${schema.hasMongoRefProp ? ', parsedPopulateAllQ' : ''}`;
  }
  return `${schema.hasMongoRefProp ? 'parsedPopulateAllQ' : ''}`;
}

function _GenerateListByIndexAPIs(schema: IProcessedGDKSchema) {
  const STRING_PROPS: GDK_PROPERTY_TYPE[] = [
    GDK_PROPERTY_TYPE.EMAIL,
    GDK_PROPERTY_TYPE.STRING,
  ];
  const codes: string[] = schema.properties.reduce(
    (allCodes: string[], prop) => {
      if (prop.isEnableMongoIndex && STRING_PROPS.includes(prop.type)) {
        const propCamelName = KebabToCamelCase(prop.name);
        allCodes.push(`${_ResolveGuards(schema, true)}
        @Get(\`\${VER_1}/\${LIST_PATH}/${prop.name}/:${propCamelName}\`)
      async list${schema.pascalCaseName}By${KebabToPascalCase(prop.name)}(
        @Param('${propCamelName}') ${propCamelName}: string,
        ${_PopulateAllQuery(schema)}
      ) {
        ${_PopulateAllParser(schema)}
        return await this.${FstLetterLowerCase(
          schema.serviceName,
        )}.${LIST_BY_UNIQUE_METHOD}${KebabToPascalCase(prop.name)}(
          ${propCamelName}
          ${_PopulateAllArg(schema)}
        )
      }
    `);
      }
      return allCodes;
    },
    [],
  );
  if (codes.length > 0) {
    return codes.join('\n');
  }
}

function _GenerateListByEnumOptionsAPI(schema: IProcessedGDKSchema) {
  const codes = schema.properties.reduce((allCodes: string[], prop) => {
    if (prop.type === GDK_PROPERTY_TYPE.ENUM_OPTION) {
      const propPascalName = KebabToPascalCase(prop.name);
      allCodes.push(`${_ResolveGuards(schema, true)}
        @Get(\`\${VER_1}/\${LIST_PATH}/${prop.name}-options\`)
        async list${schema.pascalCaseName}By${propPascalName}OptionsV1(
          @Query(\`\${Q_ENUM_OPTIONS}\`) enumOptions: string,
          ${_PopulateAllQuery(schema)}
        ) {
          ${_PopulateAllParser(schema)}
          const parsedOptions = ParseQueryStrToTypedList<${GetPropTypescriptAnnotation(
            schema,
            prop,
          )}>(enumOptions);
          return await this.${FstLetterLowerCase(
            schema.serviceName,
          )}.${LIST_BY_ENUM_OPTION_METHOD}${propPascalName}(
            parsedOptions
            ${_PopulateAllArg(schema)}
          );
        }
        `);
    }
    return allCodes;
  }, []);
  if (codes.length > 0) {
    return codes.join('\n');
  }
  return '';
}

function _SoftDeleteAPI(schema: IProcessedGDKSchema) {
  if (schema.enableSoftDelete) {
    return `${_ResolveGuards(schema, false)}
    @Delete(\`\${VER_1}/\${SOFT_DELETE_PATH}:id\`)
    async softDelete${schema.pascalCaseName}ByIdV1(
      @Param('id') id: string,
    ) {
      return await this.${FstLetterLowerCase(
        schema.serviceName,
      )}.${DELETE_BY_ID_METHOD}(id);
    }
  `;
  } else {
    return '';
  }
}

function _SharedHelperImporter(schema: IProcessedGDKSchema) {
  const requiredHelpers: string[] = [];
  if (schema.hasMongoRefProp) {
    requiredHelpers.push('ParseAnyToBoolean');
  }
  if (schema.hasEnumOptions) {
    requiredHelpers.push('ParseQueryStrToTypedList');
  }
  if (requiredHelpers.length > 0) {
    return `import { ${requiredHelpers.join(
      ',\n',
    )} } from '@shared/helper/helper';`;
  }
  return '';
}

function _GuardsImporter(schema: IProcessedGDKSchema) {
  if (schema.defaultReadRoles || schema.defaultWriteRoles) {
    return `import { ROLE } from '@gdk/user/role.static';
    import { Roles } from '@shared/decorators/roles.decorator';
    import { FirebaseJwtGuard } from '@shared/guards/firebase-jwt.guard';
    import { RolesJwtGuard } from '@shared/guards/roles-jwt.guard';
  `;
  }
  return '';
}

function _ResolveGuards(schema: IProcessedGDKSchema, isRead = true) {
  const roleUsing: string[] = [];
  if (isRead && schema.defaultReadRoles) {
    schema.defaultReadRoles
      .split(' ')
      .forEach((str) => roleUsing.push(`ROLE.${KebabToConstantCase(str)}`));
  } else if (!isRead && schema.defaultWriteRoles) {
    schema.defaultReadRoles
      .split(' ')
      .forEach((str) => roleUsing.push(`ROLE.${KebabToConstantCase(str)}`));
  } else {
    return '';
  }
  if (roleUsing.length > 0) {
    return `@UseGuards(FirebaseJwtGuard, RolesJwtGuard)
    @Roles([${roleUsing.join(',\n')}])
  `;
  }
  return '';
}

"use strict";
exports.__esModule = true;
exports.GDKV1NestControllerFile = exports.CONTROLLER_SUFFIX_NAME = void 0;
var generator_static_1 = require("../../../types/generator.static");
var generator_type_1 = require("../../../types/generator.type");
var help_1 = require("../../../utils/help");
var importers_1 = require("../../../utils/importers");
var transformers_1 = require("../../../utils/transformers");
exports.CONTROLLER_SUFFIX_NAME = 'controller';
function GDKV1NestControllerFile(schema) {
    var SERVICE_REF = "".concat((0, help_1.FstLetterLowerCase)(schema.serviceName));
    return "import { \n    Controller, Post, Get, Put, Delete, Param, Query, Body,\n    ".concat(schema.defaultWriteRoles || schema.defaultReadRoles ? 'UseGuards' : '', " \n  } from '@nestjs/common';\n  import { ApiTags } from '@nestjs/swagger';\n  import { \n    GPI, VER_1, LIST_PATH, \n    ").concat(schema.enableSoftDelete ? 'SOFT_DELETE_PATH,' : '', "\n    ").concat(schema.hasMongoRefProp ? 'Q_MONGO_POPULATE_ALL,' : '', "\n    ").concat(schema.hasEnumOptions ? 'Q_ENUM_OPTIONS' : '', "\n  } from '@shared/types/gdk';\n  ").concat((0, importers_1.SchemaStaticImporter)(schema, { enableMongoModel: false }), "\n\n  ").concat(_GuardsImporter(schema), "\n  ").concat(_SharedHelperImporter(schema), "\n\n  import { ").concat(schema.serviceName, " } from './").concat(schema.serviceFileName, "';\n  import { ").concat(schema.createFullDtoName, "} from './").concat(generator_static_1.DTOS_FOLDER_NAME, "/").concat(schema.createDtoFileName, "';\n  import { ").concat(schema.updateFullDtoName, " } from './").concat(generator_static_1.DTOS_FOLDER_NAME, "/").concat(schema.updateFullDtoFileName, "';\n\n  @ApiTags('").concat(schema.pascalCaseName, "')\n  @Controller(`${GPI}/${").concat(schema.apiConstantPathName, "}`)\n  export class ").concat(schema.controllerName, " {\n    constructor(private readonly ").concat(SERVICE_REF, ": ").concat(schema.serviceName, ") {}\n\n  ").concat(_ResolveGuards(schema, false), "\n  @Post(`${VER_1}`)\n  async create").concat(schema.pascalCaseName, "V1(\n    @Body() dto: ").concat(schema.createFullDtoName, "\n  ) {\n    return await this.").concat(SERVICE_REF, ".").concat(generator_static_1.CREATE_METHOD, "(dto);\n  }\n\n  ").concat(_GenerateListByIndexAPIs(schema), "\n\n  ").concat(_GenerateListByEnumOptionsAPI(schema), "\n\n  ").concat(_ResolveGuards(schema, true), "\n  @Get(`${VER_1}/${LIST_PATH}`)\n  async get").concat(schema.pascalCaseName, "ListV1(\n    ").concat(_PopulateAllQuery(schema), "\n  ) {\n    ").concat(_PopulateAllParser(schema), "\n    return await this.").concat(SERVICE_REF, ".").concat(generator_static_1.LIST_ALL_METHOD, "(").concat(schema.hasMongoRefProp ? 'parsedPopulateAllQ' : '', ");\n  }\n\n  ").concat(_ResolveGuards(schema, true), "\n  @Get(`${VER_1}/:id`)\n  async get").concat(schema.pascalCaseName, "ByIdV1(\n    @Param('id') id: string,\n    ").concat(_PopulateAllQuery(schema), "\n  ) {\n    ").concat(_PopulateAllParser(schema), "\n    return await this.").concat(SERVICE_REF, ".").concat(generator_static_1.GET_BY_ID_METHOD, "(id").concat(_PopulateAllArg(schema), ");\n  }\n\n  ").concat(_ResolveGuards(schema, false), "\n  @Put(`${VER_1}/:id`)\n  async update").concat(schema.pascalCaseName, "ByIdV1(\n    @Param('id') id: string,\n    @Body() dto: ").concat(schema.updateFullDtoName, ",\n  ) {\n    return await this.").concat(SERVICE_REF, ".").concat(generator_static_1.UPDATE_FULL_METHOD, "(id, dto);\n  }\n\n  ").concat(_SoftDeleteAPI(schema), "\n\n  ").concat(_ResolveGuards(schema, false), "\n  @Delete(`${VER_1}/:id`)\n  async delete").concat(schema.pascalCaseName, "ByIdV1(\n    @Param('id') id: string,\n  ) {\n    return await this.").concat(SERVICE_REF, ".").concat(generator_static_1.DELETE_BY_ID_METHOD, "(id);\n  }\n  \n}\n");
}
exports.GDKV1NestControllerFile = GDKV1NestControllerFile;
function _PopulateAllQuery(schema) {
    return "".concat(schema.hasMongoRefProp
        ? "@Query(`${Q_MONGO_POPULATE_ALL}`) isPopulateAll: string"
        : '');
}
function _PopulateAllParser(schema) {
    return "".concat(schema.hasMongoRefProp
        ? "const parsedPopulateAllQ = ParseAnyToBoolean(isPopulateAll);"
        : '');
}
function _PopulateAllArg(schema, commaPrefix) {
    if (commaPrefix === void 0) { commaPrefix = true; }
    if (commaPrefix) {
        return "".concat(schema.hasMongoRefProp ? ', parsedPopulateAllQ' : '');
    }
    return "".concat(schema.hasMongoRefProp ? 'parsedPopulateAllQ' : '');
}
function _GenerateListByIndexAPIs(schema) {
    var STRING_PROPS = [
        generator_type_1.GDK_PROPERTY_TYPE.EMAIL,
        generator_type_1.GDK_PROPERTY_TYPE.STRING,
        generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID,
        generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID,
    ];
    var codes = schema.properties.reduce(function (allCodes, prop) {
        if (prop.isEnableMongoIndex && STRING_PROPS.includes(prop.type)) {
            var propCamelName = (0, help_1.KebabToCamelCase)(prop.name);
            allCodes.push("".concat(_ResolveGuards(schema, true), "\n        @Get(`${VER_1}/${LIST_PATH}/").concat(prop.name, "/:").concat(propCamelName, "`)\n      async list").concat(schema.pascalCaseName, "By").concat((0, help_1.KebabToPascalCase)(prop.name), "(\n        @Param('").concat(propCamelName, "') ").concat(propCamelName, ": string,\n        ").concat(_PopulateAllQuery(schema), "\n      ) {\n        ").concat(_PopulateAllParser(schema), "\n        return await this.").concat((0, help_1.FstLetterLowerCase)(schema.serviceName), ".").concat(generator_static_1.LIST_BY_UNIQUE_METHOD).concat((0, help_1.KebabToPascalCase)(prop.name), "(\n          ").concat(propCamelName, "\n          ").concat(_PopulateAllArg(schema), "\n        )\n      }\n    "));
        }
        return allCodes;
    }, []);
    if (codes.length > 0) {
        return codes.join('\n');
    }
    return '';
}
function _GenerateListByEnumOptionsAPI(schema) {
    var codes = schema.properties.reduce(function (allCodes, prop) {
        if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION) {
            var propPascalName = (0, help_1.KebabToPascalCase)(prop.name);
            allCodes.push("".concat(_ResolveGuards(schema, true), "\n        @Get(`${VER_1}/${LIST_PATH}/").concat(prop.name, "-options`)\n        async list").concat(schema.pascalCaseName, "By").concat(propPascalName, "OptionsV1(\n          @Query(`${Q_ENUM_OPTIONS}`) enumOptions: string,\n          ").concat(_PopulateAllQuery(schema), "\n        ) {\n          ").concat(_PopulateAllParser(schema), "\n          const parsedOptions = ParseQueryStrToTypedList<").concat((0, transformers_1.GetPropTypescriptAnnotation)(schema, prop), ">(enumOptions);\n          return await this.").concat((0, help_1.FstLetterLowerCase)(schema.serviceName), ".").concat(generator_static_1.LIST_BY_ENUM_OPTION_METHOD).concat(propPascalName, "(\n            parsedOptions\n            ").concat(_PopulateAllArg(schema), "\n          );\n        }\n        "));
        }
        return allCodes;
    }, []);
    if (codes.length > 0) {
        return codes.join('\n');
    }
    return '';
}
function _SoftDeleteAPI(schema) {
    if (schema.enableSoftDelete) {
        return "".concat(_ResolveGuards(schema, false), "\n    @Delete(`${VER_1}/${SOFT_DELETE_PATH}/:id`)\n    async softDelete").concat(schema.pascalCaseName, "ByIdV1(\n      @Param('id') id: string,\n    ) {\n      return await this.").concat((0, help_1.FstLetterLowerCase)(schema.serviceName), ".").concat(generator_static_1.DELETE_BY_ID_METHOD, "(id);\n    }\n  ");
    }
    else {
        return '';
    }
}
function _SharedHelperImporter(schema) {
    var requiredHelpers = [];
    if (schema.hasMongoRefProp) {
        requiredHelpers.push('ParseAnyToBoolean');
    }
    if (schema.hasEnumOptions) {
        requiredHelpers.push('ParseQueryStrToTypedList');
    }
    if (requiredHelpers.length > 0) {
        return "import { ".concat(requiredHelpers.join(',\n'), " } from '@shared/helper/helper';");
    }
    return '';
}
function _GuardsImporter(schema) {
    if (schema.defaultReadRoles || schema.defaultWriteRoles) {
        return "import { ROLE } from '@gdk/user/role.static';\n    import { Roles } from '@shared/decorators/roles.decorator';\n    import { FirebaseJwtGuard } from '@shared/guards/firebase-jwt.guard';\n    import { RolesJwtGuard } from '@shared/guards/roles-jwt.guard';\n  ";
    }
    return '';
}
function _ResolveGuards(schema, isRead) {
    if (isRead === void 0) { isRead = true; }
    var roleUsing = [];
    if (isRead && schema.defaultReadRoles) {
        schema.defaultReadRoles
            .split(' ')
            .forEach(function (str) { return roleUsing.push("ROLE.".concat((0, help_1.KebabToConstantCase)(str))); });
    }
    else if (!isRead && schema.defaultWriteRoles) {
        console.log(schema.defaultWriteRoles.split(' '));
        schema.defaultWriteRoles
            .split(' ')
            .forEach(function (str) { return roleUsing.push("ROLE.".concat((0, help_1.KebabToConstantCase)(str))); });
    }
    else {
        return '';
    }
    if (roleUsing.length > 0) {
        return "@UseGuards(FirebaseJwtGuard, RolesJwtGuard)\n    @Roles([".concat(roleUsing.join(',\n'), "])\n  ");
    }
    return '';
}

"use strict";
exports.__esModule = true;
exports.SERVICE_SUFFIX_NAME = void 0;
var generator_static_1 = require("../../../types/generator.static");
var generator_type_1 = require("../../../types/generator.type");
var help_1 = require("../../../utils/help");
var transformers_1 = require("../../../utils/transformers");
var gdk_v1_schema_static_file_1 = require("../common/gdk-v1-schema-static.file");
var gdk_v1_schema_type_file_1 = require("../common/gdk-v1-schema-type.file");
var gdk_v1_mongoose_schema_file_1 = require("./gdk-v1-mongoose-schema.file");
exports.SERVICE_SUFFIX_NAME = 'service';
function GDKV1TSNestMongooseServiceFile(schema) {
    return "import { Injectable } from '@nestjs/common';\nimport { InjectModel } from '@nestjs/mongoose';\nimport { Model, ClientSession } from 'mongoose';\nimport { ".concat(schema.pascalCaseName, ", ").concat(schema.pascalCaseName, "Document } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".").concat(gdk_v1_mongoose_schema_file_1.SCHEMA_SUFFIX_NAME, "'; \n").concat(_ResolveStaticImports(schema), "\nimport { ").concat(schema.interfaceName, ", ").concat(schema.createFullDtoInterfaceName, ", ").concat(schema.updateFullDtoInterfaceName, " } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".").concat(gdk_v1_schema_type_file_1.TYPE_SUFFIX_NAME, "';\n\nimport { MongoDBErrorHandler } from '@shared/mongodb/mongodb-error-handler';\nimport { MethodLogger } from '@shared/loggers/method-logger.decorator';\n\n@Injectable()\nexport class ").concat(schema.serviceName, " {\n  constructor(\n    @InjectModel(").concat(schema.mongoModelName, ")\n    private readonly ").concat(schema.mongoModelRefName, ": Model<").concat(schema.pascalCaseName, ">,\n  ) {}\n\n  // * === [ C ] CREATE ===========\n\n  ").concat(_CreateFullMethod(schema), "\n\n  // * === [ R ] READ =============\n\n  ").concat(_GetByIdMethod(schema), "\n\n  ").concat(_GenerateGetOneUniqueMethods(schema), "\n\n  ").concat(_ListAllMethod(schema), "\n\n  ").concat(_GenerateListByIndexMethods(schema), "\n\n  ").concat(_GenerateListByEnumOptionsMethods(schema), "\n\n  // * === [ U ] UPDATE ===========\n\n  ").concat(_UpdateFullMethod(schema), "\n\n  // * === [ D ] DELETE ===========\n\n  ").concat(_SoftDeleteMethod(schema), "\n\n  ").concat(_DeleteMethod(schema), "\n\n}\n");
}
exports["default"] = GDKV1TSNestMongooseServiceFile;
function _CreateFullMethod(schema) {
    return "@MethodLogger()\n  public async ".concat(generator_static_1.CREATE_METHOD, "(\n    dto: ").concat(schema.createFullDtoInterfaceName, ",\n    session?: ClientSession,\n  ): Promise<").concat(schema.mongoDocumentRefName, "> {\n    try {\n      const newData: ").concat(schema.mongoDocumentRefName, " = await new this.").concat(schema.mongoModelRefName, "({\n        ").concat(_PropToDto(schema), "\n      }).save({ session: session });\n      return newData;\n    } catch (error) {\n      return Promise.reject(MongoDBErrorHandler(error));\n    }\n  }\n");
}
function _GetByIdMethod(schema) {
    return "@MethodLogger()\n  public async ".concat(generator_static_1.GET_BY_ID_METHOD, "(\n    id: string,\n    ").concat(schema.hasMongoRefProp ? 'populateAll = false,' : '', "\n  ): Promise<").concat(schema.mongoDocumentRefName, "> {\n    try {\n      const data = await this.").concat(schema.mongoModelRefName, ".findById(id);\n      ").concat(schema.hasMongoRefProp
        ? "if (populateAll) { \n            await data.populate(".concat(_getAllPopulateProps(schema), "); \n          }")
        : '', "\n      return data;\n    } catch (error) {\n      return Promise.reject(MongoDBErrorHandler(error));\n    }\n  }\n");
}
function _GenerateGetOneUniqueMethods(schema) {
    var codes = schema.properties.reduce(function (allCodes, prop) {
        if (prop.isUnique) {
            allCodes.push("@MethodLogger()\n  public async getBy".concat((0, help_1.KebabToPascalCase)(prop.name), "(\n    ").concat((0, help_1.KebabToCamelCase)(prop.name), ": ").concat((0, transformers_1.GetPropTypescriptAnnotation)(schema, prop), ",\n      ").concat(schema.hasMongoRefProp ? 'populateAll = false,' : '', "\n  ): Promise<").concat(schema.mongoDocumentRefName, "> {\n    try {\n      const data = await this.").concat(schema.mongoModelRefName, ".findOne({\n        ").concat((0, help_1.KebabToCamelCase)(prop.name), ": ").concat((0, help_1.KebabToCamelCase)(prop.name), "\n      });\n      ").concat(schema.hasMongoRefProp
                ? "if (populateAll) { \n            await data.populate(".concat(_getAllPopulateProps(schema), "); \n          }")
                : '', "\n      return data;\n    } catch(error) {\n      return Promise.reject(MongoDBErrorHandler(error));\n    }\n  }    \n      "));
        }
        return allCodes;
    }, []);
    if (codes.length > 0) {
        return codes.join('\n');
    }
    else {
        return '';
    }
}
function _ListAllMethod(schema) {
    return "@MethodLogger()\n  public async ".concat(generator_static_1.LIST_ALL_METHOD, "(").concat(schema.hasMongoRefProp ? 'populateAll = false,' : '', "): Promise<").concat(schema.interfaceName, "[]> {\n    try {\n      const dataList = await this.").concat(schema.mongoModelRefName, ".find().lean();\n      ").concat(schema.hasMongoRefProp
        ? "if (populateAll) { \n            await this.".concat(schema.mongoModelRefName, ".populate(dataList, { path: '").concat(_getAllPopulateProps(schema, true), "' });\n          }")
        : '', "\n      return dataList;\n    } catch(error) {\n      return Promise.reject(MongoDBErrorHandler(error));\n    }\n  }\n");
}
function _GenerateListByIndexMethods(schema) {
    var STRING_PROPS = [
        generator_type_1.GDK_PROPERTY_TYPE.EMAIL,
        generator_type_1.GDK_PROPERTY_TYPE.STRING,
        generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID,
        generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID,
    ];
    var codes = schema.properties.reduce(function (allCodes, prop) {
        if (prop.isEnableMongoIndex && STRING_PROPS.includes(prop.type)) {
            var propCamelName = (0, help_1.KebabToCamelCase)(prop.name);
            allCodes.push("@MethodLogger()\n      public async ".concat(generator_static_1.LIST_BY_UNIQUE_METHOD).concat((0, help_1.KebabToPascalCase)(prop.name), "(\n        ").concat(propCamelName, " : ").concat((0, transformers_1.GetPropTypescriptAnnotation)(schema, prop), ",\n        ").concat(schema.hasMongoRefProp ? 'populateAll = false,' : '', "\n      ): Promise<").concat(schema.interfaceName, "[]> {\n        try {\n          const dataList = await this.").concat(schema.mongoModelRefName, ".find({\n            ").concat(propCamelName, ": ").concat(propCamelName, "\n          }).lean();\n          ").concat(schema.hasMongoRefProp
                ? "if (populateAll) { \n                await this.".concat(schema.mongoModelRefName, ".populate(dataList, { path: '").concat(_getAllPopulateProps(schema, true), "' });\n              }")
                : '', "\n          return dataList;\n        } catch(error) {\n          return Promise.reject(MongoDBErrorHandler(error));\n        }\n      }\n    "));
        }
        return allCodes;
    }, []);
    if (codes.length > 0) {
        return codes.join('\n');
    }
    else {
        return '';
    }
}
function _GenerateListByEnumOptionsMethods(schema) {
    var codes = schema.properties.reduce(function (allCodes, prop) {
        if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION) {
            var propCamelName = (0, help_1.KebabToCamelCase)(prop.name);
            allCodes.push("@MethodLogger()\n      public async listBy".concat((0, help_1.KebabToPascalCase)(prop.name), "(\n        ").concat(propCamelName, "Options : ").concat((0, transformers_1.GetPropTypescriptAnnotation)(schema, prop), "[],\n        ").concat(schema.hasMongoRefProp ? 'populateAll = false,' : '', "\n      ): Promise<").concat(schema.interfaceName, "[]> {\n        try {\n          const dataList = await this.").concat(schema.mongoModelRefName, ".find({\n            ").concat(propCamelName, ": {\n              $in: ").concat(propCamelName, "Options\n            }\n          }).lean();\n          ").concat(schema.hasMongoRefProp
                ? "if (populateAll) { \n                await this.".concat(schema.mongoModelRefName, ".populate(dataList, { path: '").concat(_getAllPopulateProps(schema, true), "' });\n              }")
                : '', "\n          return dataList;\n        } catch(error) {\n          return Promise.reject(MongoDBErrorHandler(error));\n        }\n      }\n    "));
        }
        return allCodes;
    }, []);
    if (codes.length > 0) {
        return codes.join('\n');
    }
    else {
        return '';
    }
}
function _UpdateFullMethod(schema) {
    return "@MethodLogger()\n  public async ".concat(generator_static_1.UPDATE_FULL_METHOD, "(\n    id: string,\n    dto: ").concat(schema.updateFullDtoInterfaceName, ",\n    session?: ClientSession,\n    returnNew?: boolean\n  ): Promise<").concat(schema.mongoDocumentRefName, "> {\n    try {\n      const updatedData: ").concat(schema.mongoDocumentRefName, " = await this.").concat(schema.mongoModelRefName, ".findByIdAndUpdate(\n        id,\n        {\n          ").concat(_PropToDto(schema, true), "\n        },\n        { new: returnNew ? true : false , session: session }\n      );\n      return updatedData;\n    } catch (error) {\n      return Promise.reject(MongoDBErrorHandler(error));\n    }\n  }\n");
}
function _SoftDeleteMethod(schema) {
    return "@MethodLogger()\n  public async ".concat(generator_static_1.SOFT_DELETE_METHOD, "(\n    id: string,\n    dto: ").concat(schema.updateFullDtoInterfaceName, ",\n    session?: ClientSession,\n    returnNew?: boolean\n  ): Promise<").concat(schema.mongoDocumentRefName, "> {\n    try {\n      const updatedData: ").concat(schema.mongoDocumentRefName, " = await this.").concat(schema.mongoModelRefName, ".findByIdAndUpdate(\n        id,\n        {\n          ").concat((0, help_1.KebabToCamelCase)(generator_static_1.SOFT_DELETE_PROP_NAME), ": true,\n          ").concat(schema.includeUpdatedAt
        ? "".concat((0, help_1.KebabToCamelCase)(generator_static_1.UPDATED_AT_PROP_NAME), ": new Date().getTime(),")
        : '', "\n        },\n        { new: returnNew ? true : false , session: session }\n      );\n      return updatedData;\n    } catch (error) {\n      return Promise.reject(MongoDBErrorHandler(error));\n    }\n  }\n");
}
function _DeleteMethod(schema) {
    return "@MethodLogger()\n  public async ".concat(generator_static_1.DELETE_BY_ID_METHOD, "(\n    id: string,\n    session?: ClientSession,\n  ): Promise<").concat(schema.mongoDocumentRefName, "> {\n    try {\n      const deletedData: ").concat(schema.mongoDocumentRefName, " = await this.").concat(schema.mongoModelRefName, ".findByIdAndDelete(\n        id,\n        { session: session }\n      );\n      return deletedData;\n    } catch (error) {\n      return Promise.reject(MongoDBErrorHandler(error));\n    }\n  }\n");
}
function _PropToDto(schema, isUpdate) {
    if (isUpdate === void 0) { isUpdate = false; }
    var codes = schema.properties.reduce(function (allCodes, prop) {
        var camelName = (0, help_1.KebabToCamelCase)(prop.name);
        if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.DURATION) {
            allCodes.push("".concat(camelName).concat(generator_static_1.DURATION_START_SUFFIX, ": dto.").concat(camelName).concat(generator_static_1.DURATION_START_SUFFIX));
            allCodes.push("".concat(camelName).concat(generator_static_1.DURATION_END_SUFFIX, ": dto.").concat(camelName).concat(generator_static_1.DURATION_END_SUFFIX));
        }
        else {
            allCodes.push("".concat(camelName, ": dto.").concat(camelName));
        }
        return allCodes;
    }, []);
    if (isUpdate && schema.includeUpdatedAt) {
        codes.push("".concat((0, help_1.KebabToCamelCase)(generator_static_1.UPDATED_AT_PROP_NAME), ": new Date().getTime()"));
    }
    return codes.join(',\n');
}
function _ResolveStaticImports(schema) {
    var importNames = ["".concat(schema.mongoModelName)];
    var enumProps = schema.properties.filter(function (prop) { return prop.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION; });
    if (enumProps.length > 0) {
        enumProps.forEach(function (prop) {
            importNames.push("".concat(schema.constantCaseName, "_").concat((0, help_1.KebabToConstantCase)(prop.name)));
        });
    }
    return "import { ".concat(importNames.join(','), " } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".").concat(gdk_v1_schema_static_file_1.STATIC_SUFFIX_NAME, "'");
}
function _getAllPopulateProps(schema, returnPathString) {
    if (returnPathString === void 0) { returnPathString = false; }
    var populateNames = schema.properties.reduce(function (propNames, prop) {
        if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID ||
            prop.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY ||
            prop.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID) {
            if (!returnPathString) {
                propNames.push("'".concat((0, help_1.KebabToCamelCase)(prop.name), "'"));
            }
            else {
                propNames.push("".concat((0, help_1.KebabToCamelCase)(prop.name)));
            }
        }
        return propNames;
    }, []);
    if (populateNames.length > 0) {
        if (returnPathString) {
            return populateNames.join(' ');
        }
        else {
            return "[".concat(populateNames.join(','), "]");
        }
    }
    else {
        return '';
    }
}

"use strict";
exports.__esModule = true;
exports.GDKV1NestSchemaCreateDtoFile = exports.DTO_SUFFIX = exports.UPDATE_FULL_DTO_PREFIX = exports.CREATE_DTO_PREFIX = void 0;
var generator_type_1 = require("../../../types/generator.type");
var importers_1 = require("../../../utils/importers");
var transformers_1 = require("../../../utils/transformers");
var gdk_v1_schema_static_file_1 = require("./gdk-v1-schema-static.file");
var gdk_v1_schema_type_file_1 = require("./gdk-v1-schema-type.file");
exports.CREATE_DTO_PREFIX = 'create-';
exports.UPDATE_FULL_DTO_PREFIX = 'update-full-';
exports.DTO_SUFFIX = 'dto';
function GDKV1NestSchemaCreateDtoFile(schema) {
    return "import {".concat(schema.createFullDtoInterfaceName, " } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".").concat(gdk_v1_schema_type_file_1.TYPE_SUFFIX_NAME, "';\n  ").concat((0, importers_1.ResolveClassValidatorsImport)(schema), "\n  ").concat(_ResolveStaticImports(schema), "\n  export class ").concat(schema.createFullDtoName, " implements ").concat(schema.createFullDtoInterfaceName, " {\n    ").concat((0, transformers_1.PropsToDtoProps)(schema), "\n}\n");
}
exports.GDKV1NestSchemaCreateDtoFile = GDKV1NestSchemaCreateDtoFile;
function _ResolveStaticImports(schema) {
    var enumProps = schema.properties.filter(function (p) { return p.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION; });
    return "import {\n    ".concat(enumProps.map(function (eP) { return (0, transformers_1.GetEnumConstantCase)(schema, eP); }), "\n  } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".").concat(gdk_v1_schema_static_file_1.STATIC_SUFFIX_NAME, "';\n");
}

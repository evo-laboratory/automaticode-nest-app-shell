"use strict";
exports.__esModule = true;
exports.GDKV1NestSchemaUpdateDtoFile = void 0;
var generator_type_1 = require("../../../types/generator.type");
var importers_1 = require("../../../utils/importers");
var transformers_1 = require("../../../utils/transformers");
var gdk_v1_schema_static_file_1 = require("./gdk-v1-schema-static.file");
var gdk_v1_schema_type_file_1 = require("./gdk-v1-schema-type.file");
function GDKV1NestSchemaUpdateDtoFile(schema) {
    return "import { ".concat(schema.updateFullDtoInterfaceName, " } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".").concat(gdk_v1_schema_type_file_1.TYPE_SUFFIX_NAME, "'\n  ").concat((0, importers_1.ResolveClassValidatorsImport)(schema), "\n  ").concat(_ResolveStaticImports(schema), "\n  export class ").concat(schema.updateFullDtoName, " implements ").concat(schema.updateFullDtoInterfaceName, " {\n    ").concat((0, transformers_1.PropsToDtoProps)(schema), "\n  }\n");
}
exports.GDKV1NestSchemaUpdateDtoFile = GDKV1NestSchemaUpdateDtoFile;
function _ResolveStaticImports(schema) {
    var enumProps = schema.properties.filter(function (p) { return p.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION; });
    return "import {\n    ".concat(enumProps.map(function (eP) { return (0, transformers_1.GetEnumConstantCase)(schema, eP); }), "\n  } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".").concat(gdk_v1_schema_static_file_1.STATIC_SUFFIX_NAME, "';\n");
}

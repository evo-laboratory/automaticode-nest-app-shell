"use strict";
exports.__esModule = true;
exports.STATIC_SUFFIX_NAME = void 0;
var generator_type_1 = require("../../../types/generator.type");
var help_1 = require("../../../utils/help");
var transformers_1 = require("../../../utils/transformers");
exports.STATIC_SUFFIX_NAME = 'static';
function GDKV1SchemaStaticFile(schema) {
    return "export const ".concat(schema.apiConstantPathName, " = '").concat(schema.apiConstantPath, "';\n  export const ").concat(schema.mongoModelName, " = '").concat(schema.pascalCaseName, "';\n  ").concat(_ResolveEnumCodes(schema), "\n  ");
}
exports["default"] = GDKV1SchemaStaticFile;
function _ResolveEnumCodes(schema) {
    var codes = schema.properties.reduce(function (result, prop) {
        if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION &&
            prop.enumOptions.length > 0) {
            result.push("\nexport enum ".concat((0, transformers_1.GetEnumConstantCase)(schema, prop), " {\n").concat(_OptionsToEnum(prop.enumOptions), "}"));
            return result;
        }
        else {
            return result;
        }
    }, []);
    if (codes.length > 0) {
        return codes.join('\n');
    }
    else {
        return '';
    }
}
function _OptionsToEnum(enumOptions) {
    var result = enumOptions.map(function (op) {
        return "".concat((0, help_1.KebabToConstantCase)(op), " = '").concat((0, help_1.KebabToConstantCase)(op), "',");
    });
    if (result.length > 0) {
        return result.join('\n');
    }
    else {
        return '';
    }
}

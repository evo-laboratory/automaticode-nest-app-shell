"use strict";
exports.__esModule = true;
exports.SchemaStaticImporter = exports.ResolveClassValidatorsImport = exports.ResolveReferenceImports = exports.ResolveStaticEnumImports = void 0;
var gdk_v1_schema_static_file_1 = require("../templates/ts-nest/common/gdk-v1-schema-static.file");
var generator_static_1 = require("../types/generator.static");
var generator_type_1 = require("../types/generator.type");
var help_1 = require("./help");
var transformers_1 = require("./transformers");
function ResolveStaticEnumImports(schema) {
    // ! Use SchemaStaticImporter, deprecate this
    // * Enum Imports
    var enumProps = schema.properties
        .filter(function (prop) { return prop.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION; })
        .map(function (enumProp) {
        return "".concat(schema.constantCaseName, "_").concat((0, help_1.KebabToConstantCase)(enumProp.name), ",");
    });
    if (enumProps.length > 0) {
        return "import { ".concat(enumProps.join('\n'), "\n      } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".").concat(gdk_v1_schema_static_file_1.STATIC_SUFFIX_NAME, "';");
    }
    else {
        return '';
    }
}
exports.ResolveStaticEnumImports = ResolveStaticEnumImports;
function ResolveReferenceImports(schema) {
    var imports = [];
    var hasUserRefProps = schema.properties.filter(function (prop) { return prop.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID; });
    var hasRefProps = schema.properties.filter(function (prop) {
        return prop.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID ||
            prop.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY;
    });
    if (hasUserRefProps.length > 0) {
        imports.push("import { USER_MODEL_NAME } from '@gdk/user/user.static';");
    }
    if (hasRefProps.length > 0) {
        hasRefProps.forEach(function (prop) {
            imports.push("import { ".concat((0, transformers_1.GetMongoModelName)(prop.referenceSchemaName), " } from '@gdk/").concat(prop.referenceSchemaName, "/").concat(prop.referenceSchemaName, ".").concat(gdk_v1_schema_static_file_1.STATIC_SUFFIX_NAME, "';"));
        });
    }
    return imports.join('\n');
}
exports.ResolveReferenceImports = ResolveReferenceImports;
function ResolveClassValidatorsImport(schema) {
    var usingValidatorNames = new Set([]);
    schema.properties.forEach(function (p) {
        switch (p.type) {
            case generator_type_1.GDK_PROPERTY_TYPE.STRING:
                usingValidatorNames.add('IsString');
                break;
            case generator_type_1.GDK_PROPERTY_TYPE.NUMBER:
                usingValidatorNames.add('IsNumber');
                break;
            case generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN:
                usingValidatorNames.add('IsBoolean');
            case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID:
                usingValidatorNames.add('IsString');
                usingValidatorNames.add('ValidateIf');
                break;
            case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
                usingValidatorNames.add('IsString');
                usingValidatorNames.add('ValidateIf');
                break;
            case generator_type_1.GDK_PROPERTY_TYPE.DATE:
                usingValidatorNames.add('IsNumber');
                break;
            case generator_type_1.GDK_PROPERTY_TYPE.TIMESTAMP:
                usingValidatorNames.add('IsNumber');
                break;
            case generator_type_1.GDK_PROPERTY_TYPE.DURATION:
                usingValidatorNames.add('IsNumber');
                break;
            case generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION:
                usingValidatorNames.add('IsString');
                usingValidatorNames.add('IsEnum');
                usingValidatorNames.add('IsNotEmpty');
                break;
            case generator_type_1.GDK_PROPERTY_TYPE.EMAIL:
                usingValidatorNames.add('IsString');
                usingValidatorNames.add('IsEmail');
            case generator_type_1.GDK_PROPERTY_TYPE.IMAGE_URL:
                usingValidatorNames.add('IsString');
                break;
            default:
                break;
        }
        if (p.isRequired) {
            usingValidatorNames.add('IsNotEmpty');
        }
    });
    var arrayOfValidators = Array.from(usingValidatorNames);
    return "import { ".concat(arrayOfValidators.join(',\n'), " } from 'class-validator';\n");
}
exports.ResolveClassValidatorsImport = ResolveClassValidatorsImport;
function SchemaStaticImporter(schema, _a) {
    var _b = _a.enableAPI, enableAPI = _b === void 0 ? true : _b, _c = _a.enableMongoModel, enableMongoModel = _c === void 0 ? true : _c, _d = _a.enableEnum, enableEnum = _d === void 0 ? true : _d;
    if (!enableAPI && !enableEnum) {
        return '';
    }
    var exportItems = [];
    if (enableAPI) {
        exportItems.push(schema.apiConstantPathName);
    }
    if (enableMongoModel) {
        exportItems.push(schema.mongoModelName);
    }
    if (enableEnum) {
        schema.properties.forEach(function (prop) {
            if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION) {
                exportItems.push("".concat(schema.constantCaseName, "_").concat((0, help_1.KebabToConstantCase)(prop.name)));
            }
        });
    }
    return "import { ".concat(exportItems.join(',\n'), " } from '").concat(generator_static_1.IMPORT_GDK, "/").concat(schema.kebabCaseName, "/").concat(schema.staticFileName, "';\n");
}
exports.SchemaStaticImporter = SchemaStaticImporter;

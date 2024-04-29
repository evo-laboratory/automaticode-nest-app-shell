"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.GetMongoModelSchemaRefName = exports.GetMongoModelDocumentRefName = exports.GetMongoModelRefName = exports.GetMongoModelName = exports.GetEnumConstantCase = exports.ParseAnyToBoolean = exports.PropsToDtoProps = exports.GetPropTypescriptAnnotation = exports.GetPropMongoDefault = exports.GetPropMongoType = exports.ProcessGDKSchemaJSONFile = void 0;
var gdk_v1_controller_file_1 = require("../templates/ts-nest/common/gdk-v1-controller.file");
var gdk_v1_module_file_1 = require("../templates/ts-nest/common/gdk-v1-module.file");
var gdk_v1_schema_create_dto_file_1 = require("../templates/ts-nest/common/gdk-v1-schema-create-dto.file");
var gdk_v1_schema_static_file_1 = require("../templates/ts-nest/common/gdk-v1-schema-static.file");
var gdk_v1_schema_type_file_1 = require("../templates/ts-nest/common/gdk-v1-schema-type.file");
var gdk_v1_mongoose_schema_file_1 = require("../templates/ts-nest/mongodb/gdk-v1-mongoose-schema.file");
var gdk_v1_mongoose_service_file_1 = require("../templates/ts-nest/mongodb/gdk-v1-mongoose-service.file");
var generator_static_1 = require("../types/generator.static");
var generator_type_1 = require("../types/generator.type");
var help_1 = require("./help");
function ProcessGDKSchemaJSONFile(schema) {
    var REF_PROP_TYPES = [
        generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID,
        generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY,
        generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID,
    ];
    var kebabCaseName = schema.name;
    var camelCaseName = (0, help_1.KebabToCamelCase)(kebabCaseName);
    var pascalCaseName = (0, help_1.KebabToPascalCase)(kebabCaseName);
    var constantCaseName = (0, help_1.KebabToConstantCase)(kebabCaseName);
    var apiConstantPathName = "".concat(constantCaseName, "_API");
    var apiConstantPath = kebabCaseName;
    var schemaFileName = "".concat(kebabCaseName, ".").concat(gdk_v1_mongoose_schema_file_1.SCHEMA_SUFFIX_NAME);
    var staticFileName = "".concat(kebabCaseName, ".").concat(gdk_v1_schema_static_file_1.STATIC_SUFFIX_NAME);
    var typeFileName = "".concat(kebabCaseName, ".").concat(gdk_v1_schema_type_file_1.TYPE_SUFFIX_NAME);
    var serviceFileName = "".concat(kebabCaseName, ".").concat(gdk_v1_mongoose_service_file_1.SERVICE_SUFFIX_NAME);
    var controllerFileName = "".concat(kebabCaseName, ".").concat(gdk_v1_controller_file_1.CONTROLLER_SUFFIX_NAME);
    var moduleFileName = "".concat(kebabCaseName, ".").concat(gdk_v1_module_file_1.MODULE_SUFFIX_NAME);
    var createDtoFileName = "".concat(gdk_v1_schema_create_dto_file_1.CREATE_DTO_PREFIX).concat(kebabCaseName, ".").concat(gdk_v1_schema_create_dto_file_1.DTO_SUFFIX);
    var updateFullDtoFileName = "".concat(gdk_v1_schema_create_dto_file_1.UPDATE_FULL_DTO_PREFIX).concat(kebabCaseName, ".").concat(gdk_v1_schema_create_dto_file_1.DTO_SUFFIX);
    var hasMongoIndex = schema.properties.some(function (p) { return p.isEnableMongoIndex; });
    var hasMongoRefProp = schema.properties.some(function (p) {
        return REF_PROP_TYPES.includes(p.type);
    });
    var hasEnumOptions = schema.properties.some(function (p) { return p.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION; });
    var createDtoName = "Create".concat(pascalCaseName, "FullDto");
    var updateDtoName = "Update".concat(pascalCaseName, "FullDto");
    return __assign(__assign({}, schema), { hasMongoIndex: hasMongoIndex, hasMongoRefProp: hasMongoRefProp, hasEnumOptions: hasEnumOptions, kebabCaseName: kebabCaseName, camelCaseName: camelCaseName, pascalCaseName: pascalCaseName, interfaceName: "I".concat(pascalCaseName), constantCaseName: constantCaseName, apiConstantPathName: apiConstantPathName, apiConstantPath: apiConstantPath, staticFileName: staticFileName, typeFileName: typeFileName, serviceFileName: serviceFileName, controllerFileName: controllerFileName, moduleFileName: moduleFileName, createDtoFileName: createDtoFileName, updateFullDtoFileName: updateFullDtoFileName, mongoModelName: "".concat(GetMongoModelName(kebabCaseName)), mongoModelRefName: "".concat(GetMongoModelRefName(kebabCaseName)), mongoDocumentRefName: "".concat(GetMongoModelDocumentRefName(kebabCaseName)), mongoSchemaRefName: "".concat(GetMongoModelSchemaRefName(kebabCaseName)), createFullDtoName: createDtoName, updateFullDtoName: updateDtoName, createFullDtoInterfaceName: "I".concat(createDtoName), updateFullDtoInterfaceName: "I".concat(updateDtoName), serviceName: "".concat(pascalCaseName, "Service"), controllerName: "".concat(pascalCaseName, "Controller"), schemaFileName: schemaFileName, moduleName: "".concat(pascalCaseName, "Module") });
}
exports.ProcessGDKSchemaJSONFile = ProcessGDKSchemaJSONFile;
function GetPropMongoType(schema, prop) {
    var type = 'String';
    switch (prop.type) {
        case generator_type_1.GDK_PROPERTY_TYPE.STRING:
            type = 'String';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.NUMBER:
            type = 'Number';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN:
            type = 'Boolean';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
            type = 'mongoose.Schema.Types.ObjectId';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID:
            type = 'mongoose.Schema.Types.ObjectId';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY:
            type = '[mongoose.Schema.Types.ObjectId]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.TIMESTAMP:
            type = 'Number';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.DURATION:
            type = 'Number';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION:
            type = "String";
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.STRING_ARRAY:
            type = '[String]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.NUMBER_ARRAY:
            type = '[Number]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN_ARRAY:
            type = '[Boolean]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.OBJECT:
            type = 'mongoose.Schema.Types.Mixed';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.EMAIL:
            type = 'String';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.IMAGE_URL:
            type = 'String';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.IMAGE_URL_ARRAY:
            type = '[String]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.QUILL_RICH_TEXT_EDITOR:
            type = 'mongoose.Schema.Types.Mixed';
            break;
        default:
            break;
    }
    return type;
}
exports.GetPropMongoType = GetPropMongoType;
function GetPropMongoDefault(schema, prop) {
    var defaultValue = null;
    switch (prop.type) {
        case generator_type_1.GDK_PROPERTY_TYPE.STRING:
            defaultValue = prop["default"] ? "".concat(prop["default"]) : "''";
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.NUMBER:
            defaultValue = prop["default"] ? Number(prop["default"]) : 0;
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN:
            defaultValue = ParseAnyToBoolean(prop["default"]);
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
            defaultValue = null;
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID:
            defaultValue = null;
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY:
            defaultValue = "[]";
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.TIMESTAMP:
            defaultValue = Number(prop["default"]) || 0;
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.DURATION:
            defaultValue = Number(prop["default"]) || 0;
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION:
            defaultValue = prop["default"]
                ? "".concat((0, help_1.KebabToConstantCase)(schema.name), "_").concat((0, help_1.KebabToConstantCase)(prop.name), ".").concat((0, help_1.KebabToConstantCase)(prop["default"]))
                : null;
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.STRING_ARRAY:
            defaultValue = "[]";
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.NUMBER_ARRAY:
            defaultValue = "[]";
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN_ARRAY:
            defaultValue = "[]";
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.OBJECT:
            defaultValue = "{}";
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.EMAIL:
            defaultValue = null;
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.IMAGE_URL:
            defaultValue = null;
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.IMAGE_URL_ARRAY:
            defaultValue = "[]";
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.QUILL_RICH_TEXT_EDITOR:
            defaultValue = "{}";
            break;
        default:
            break;
    }
    return "".concat(defaultValue);
}
exports.GetPropMongoDefault = GetPropMongoDefault;
function GetPropTypescriptAnnotation(schema, prop) {
    var annotation = 'any';
    switch (prop.type) {
        case generator_type_1.GDK_PROPERTY_TYPE.STRING:
            annotation = 'string';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.NUMBER:
            annotation = 'number';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN:
            annotation = 'boolean';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
            annotation = 'any';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID:
            annotation = 'any';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY:
            annotation = 'any[]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.TIMESTAMP:
            annotation = 'number';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.DURATION:
            annotation = 'number';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION:
            annotation = "".concat(GetEnumConstantCase(schema, prop));
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.STRING_ARRAY:
            annotation = 'string[]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.NUMBER_ARRAY:
            annotation = 'number[]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN_ARRAY:
            annotation = 'boolean[]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.OBJECT:
            annotation = 'any';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.EMAIL:
            annotation = 'string';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.IMAGE_URL:
            annotation = 'string';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.IMAGE_URL_ARRAY:
            annotation = 'string[]';
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.QUILL_RICH_TEXT_EDITOR:
            annotation = 'any';
            break;
        default:
            break;
    }
    return annotation;
}
exports.GetPropTypescriptAnnotation = GetPropTypescriptAnnotation;
function PropsToDtoProps(schema) {
    var props = schema.properties.reduce(function (allDtoProps, prop) {
        var transformedCodes = _PropToDtoProp(schema, prop);
        return allDtoProps.concat(transformedCodes);
    }, []);
    return props.join('\n');
}
exports.PropsToDtoProps = PropsToDtoProps;
function _PropToDtoProp(schema, prop) {
    var classValidators = [];
    switch (prop.type) {
        case generator_type_1.GDK_PROPERTY_TYPE.STRING:
            classValidators.push("@IsString()");
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.NUMBER:
            classValidators.push("@IsNumber()");
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN:
            classValidators.push("@IsBoolean()");
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID:
            classValidators.push("@IsString()");
            classValidators.push("@ValidateIf((object, value) => value !== null)");
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID:
            classValidators.push("@IsString()");
            classValidators.push("@ValidateIf((object, value) => value !== null)");
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.DATE:
            classValidators.push("@IsNumber()");
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.TIMESTAMP:
            classValidators.push("@IsNumber()");
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.DURATION:
            classValidators.push("@IsNumber()");
            classValidators.push("".concat((0, help_1.KebabToCamelCase)(prop.name)).concat(generator_static_1.DURATION_START_SUFFIX, ": ").concat(GetPropTypescriptAnnotation(schema, prop), "\n"));
            classValidators.push("@IsNumber()");
            classValidators.push("".concat((0, help_1.KebabToCamelCase)(prop.name)).concat(generator_static_1.DURATION_END_SUFFIX, ": ").concat(GetPropTypescriptAnnotation(schema, prop), "\n"));
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION:
            classValidators.push("@IsString()");
            classValidators.push("@IsNotEmpty()");
            classValidators.push("@IsEnum(".concat(GetEnumConstantCase(schema, prop), ", { each: true })"));
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.EMAIL:
            classValidators.push("@IsString()");
            classValidators.push("@IsEmail()");
            break;
        case generator_type_1.GDK_PROPERTY_TYPE.IMAGE_URL:
            classValidators.push("@IsString()");
        default:
            break;
    }
    if (prop.isRequired) {
        classValidators.push('@IsNotEmpty()');
    }
    if (prop.type !== generator_type_1.GDK_PROPERTY_TYPE.DURATION) {
        // * Already handled in above switch block
        classValidators.push("".concat((0, help_1.KebabToCamelCase)(prop.name), ": ").concat(GetPropTypescriptAnnotation(schema, prop), "\n"));
    }
    return classValidators;
}
function ParseAnyToBoolean(input) {
    var inputText = "".concat(input).toUpperCase();
    var TRUE_VARIANTS = ['TRUE', 'T'];
    var FALSE_VARIANTS = ['FALSE', 'F'];
    if (TRUE_VARIANTS.includes(inputText)) {
        return true;
    }
    else if (FALSE_VARIANTS.includes(inputText)) {
        return false;
    }
    else {
        return false;
    }
}
exports.ParseAnyToBoolean = ParseAnyToBoolean;
function GetEnumConstantCase(schema, prop) {
    if (prop.skipEnumSchemaPrefix) {
        return "".concat((0, help_1.KebabToConstantCase)(prop.name));
    }
    return "".concat(schema.constantCaseName, "_").concat((0, help_1.KebabToConstantCase)(prop.name));
}
exports.GetEnumConstantCase = GetEnumConstantCase;
function GetMongoModelName(name) {
    return "".concat((0, help_1.KebabToConstantCase)(name), "_MODEL_NAME");
}
exports.GetMongoModelName = GetMongoModelName;
function GetMongoModelRefName(name) {
    return "".concat((0, help_1.KebabToPascalCase)(name), "Model");
}
exports.GetMongoModelRefName = GetMongoModelRefName;
function GetMongoModelDocumentRefName(name) {
    return "".concat((0, help_1.KebabToPascalCase)(name), "Document");
}
exports.GetMongoModelDocumentRefName = GetMongoModelDocumentRefName;
function GetMongoModelSchemaRefName(name) {
    return "".concat((0, help_1.KebabToPascalCase)(name), "Schema");
}
exports.GetMongoModelSchemaRefName = GetMongoModelSchemaRefName;

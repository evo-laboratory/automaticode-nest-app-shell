"use strict";
exports.__esModule = true;
exports.TYPE_SUFFIX_NAME = void 0;
var generator_static_1 = require("../../../types/generator.static");
var generator_type_1 = require("../../../types/generator.type");
var help_1 = require("../../../utils/help");
var importers_1 = require("../../../utils/importers");
var transformers_1 = require("../../../utils/transformers");
exports.TYPE_SUFFIX_NAME = 'type';
function GDKV1SchemaTypeFile(schema) {
    return "".concat((0, importers_1.ResolveStaticEnumImports)(schema), "\n\nexport interface ").concat(schema.interfaceName, " {\n  ").concat(_FillInFields(schema), "\n}\n\n").concat(_CreateFullDto(schema), "\n").concat(_UpdateFullDto(schema), "\n");
}
exports["default"] = GDKV1SchemaTypeFile;
function _FillInFields(schema) {
    var codes = schema.properties.map(function (prop) {
        return _PropToFields(schema, prop);
    });
    if (schema.includeCreatedAt) {
        codes.push(_PropToFields(schema, _CreatedAtProp()));
    }
    if (schema.includeUpdatedAt) {
        codes.push(_PropToFields(schema, _UpdatedAtProp()));
    }
    if (schema.enableSoftDelete) {
        codes.push(_PropToFields(schema, _SoftDeleteProp()));
    }
    return codes.join('\n  ');
}
function _PropToFields(schema, prop) {
    if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.DURATION) {
        return "".concat((0, help_1.KebabToCamelCase)(prop.name)).concat(generator_static_1.DURATION_START_SUFFIX, ": number;\n    ").concat((0, help_1.KebabToCamelCase)(prop.name)).concat(generator_static_1.DURATION_END_SUFFIX, ": number");
    }
    else {
        return "".concat((0, help_1.KebabToCamelCase)(prop.name), ": ").concat((0, transformers_1.GetPropTypescriptAnnotation)(schema, prop), ";");
    }
}
function _CreateFullDto(schema) {
    var omitPropNames = [];
    if (schema.includeCreatedAt) {
        omitPropNames.push(generator_static_1.CREATED_AT_PROP_NAME);
    }
    if (schema.includeUpdatedAt) {
        omitPropNames.push(generator_static_1.UPDATED_AT_PROP_NAME);
    }
    if (schema.enableSoftDelete) {
        omitPropNames.push(generator_static_1.SOFT_DELETE_PROP_NAME);
    }
    if (omitPropNames.length === 0) {
        return "export type ".concat(schema.createFullDtoInterfaceName, " = ").concat(schema.interfaceName);
    }
    else {
        return "export type ".concat(schema.createFullDtoInterfaceName, " = Omit<").concat(schema.interfaceName, ",").concat(omitPropNames.map(function (p) { return "'".concat((0, help_1.KebabToCamelCase)(p), "'\n"); }).join('|'), ">;");
    }
}
function _UpdateFullDto(schema) {
    return "export type ".concat(schema.updateFullDtoInterfaceName, " = ").concat(schema.createFullDtoInterfaceName, ";");
}
function _CreatedAtProp() {
    return {
        name: generator_static_1.CREATED_AT_PROP_NAME,
        alias: '',
        descriptionNote: 'includedCreatedAt',
        type: generator_type_1.GDK_PROPERTY_TYPE.TIMESTAMP,
        "default": null,
        isRequired: false,
        isUnique: false,
        isEnableMongoIndex: false,
        referenceSchemaName: '',
        enumOptions: []
    };
}
function _UpdatedAtProp() {
    return {
        name: generator_static_1.UPDATED_AT_PROP_NAME,
        alias: '',
        descriptionNote: 'includedUpdatedAt',
        type: generator_type_1.GDK_PROPERTY_TYPE.TIMESTAMP,
        "default": null,
        isRequired: false,
        isUnique: false,
        isEnableMongoIndex: false,
        referenceSchemaName: '',
        enumOptions: []
    };
}
function _SoftDeleteProp() {
    return {
        name: generator_static_1.SOFT_DELETE_PROP_NAME,
        alias: '',
        descriptionNote: 'enableSoftDeleted',
        type: generator_type_1.GDK_PROPERTY_TYPE.BOOLEAN,
        "default": false,
        isRequired: false,
        isUnique: false,
        isEnableMongoIndex: false,
        referenceSchemaName: '',
        enumOptions: []
    };
}

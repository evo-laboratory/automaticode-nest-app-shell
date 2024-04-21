"use strict";
exports.__esModule = true;
exports.SCHEMA_SUFFIX_NAME = void 0;
var generator_static_1 = require("../../../types/generator.static");
var generator_type_1 = require("../../../types/generator.type");
var help_1 = require("../../../utils/help");
var importers_1 = require("../../../utils/importers");
var transformers_1 = require("../../../utils/transformers");
exports.SCHEMA_SUFFIX_NAME = 'schema';
function GDKV1TSNestMongooseSchemaFile(schema) {
    return "import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';\nimport { HydratedDocument } from 'mongoose';\n\nimport { MongoModelBuilder } from '@shared/mongodb/mongodb-model-builder';\n".concat(_ResolveFileImports(schema), "\n").concat((0, importers_1.ResolveReferenceImports)(schema), "\n\n").concat((0, importers_1.ResolveStaticEnumImports)(schema), "\nimport { ").concat(schema.interfaceName, " } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".type';\n\nimport { ").concat(schema.mongoModelName, " } from '@gdk/").concat(schema.kebabCaseName, "/").concat(schema.kebabCaseName, ".static';\n\nexport type ").concat(schema.pascalCaseName, "Document = HydratedDocument<").concat(schema.pascalCaseName, ">;\n\n@Schema()\nexport class ").concat(schema.pascalCaseName, " implements ").concat(schema.interfaceName, " {\n  ").concat(_GenerateProps(schema), "\n}\n\nexport const ").concat(schema.mongoSchemaRefName, " =\n  SchemaFactory.createForClass(").concat(schema.pascalCaseName, ");\n").concat(schema.hasMongoIndex ? _ResolvePropSingleIndex(schema) : '', "\nexport const ").concat(schema.mongoModelRefName, " = MongoModelBuilder(\n  ").concat(schema.mongoModelName, ",\n  ").concat(schema.mongoSchemaRefName, ",\n);\n");
}
exports["default"] = GDKV1TSNestMongooseSchemaFile;
function _GenerateProps(schema) {
    var codes = schema.properties.map(function (prop) {
        return _GDKPropToSchemaProp(schema, prop);
    });
    if (schema.includeCreatedAt) {
        codes.push("@Prop({ type: Number, default: Date.now()})\n    ".concat((0, help_1.KebabToCamelCase)(generator_static_1.CREATED_AT_PROP_NAME), ": number"));
    }
    if (schema.includeCreatedAt) {
        codes.push("@Prop({ type: Number, default: Date.now()})\n    ".concat((0, help_1.KebabToCamelCase)(generator_static_1.UPDATED_AT_PROP_NAME), ": number"));
    }
    if (schema.enableSoftDelete) {
        codes.push("@Prop({ type: Boolean, default: false})\n    ".concat((0, help_1.KebabToCamelCase)(generator_static_1.SOFT_DELETE_PROP_NAME), ": boolean"));
    }
    return codes.join('\n\n');
}
function _GDKPropToSchemaProp(schema, prop) {
    if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.DURATION) {
        return "@Prop({ type: Number, default: null })\n    ".concat((0, help_1.KebabToCamelCase)(prop.name)).concat(generator_static_1.DURATION_START_SUFFIX, ": number;\n\n    @Prop({ type: Number, default: null })\n    ").concat((0, help_1.KebabToCamelCase)(prop.name)).concat(generator_static_1.DURATION_END_SUFFIX, ": number;");
    }
    else {
        return "@Prop({".concat(_RenderPropContent(schema, prop), "})\n    ").concat((0, help_1.KebabToCamelCase)(prop.name), ": ").concat((0, transformers_1.GetPropTypescriptAnnotation)(schema, prop), ";");
    }
}
function _RenderPropContent(schema, prop) {
    var contents = [
        "type: ".concat((0, transformers_1.GetPropMongoType)(schema, prop), ","),
        "default: ".concat((0, transformers_1.GetPropMongoDefault)(schema, prop), ","),
        "required: ".concat(prop.isRequired ? true : false, ","),
    ];
    if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION) {
        contents.push("enum: EnumToArray(".concat((0, transformers_1.GetEnumConstantCase)(schema, prop), "),"));
    }
    if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID) {
        contents.push("ref: USER_MODEL_NAME,");
    }
    if (prop.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID) {
        contents.push("ref: ".concat((0, transformers_1.GetMongoModelName)(prop.referenceSchemaName), ","));
    }
    if (prop.isUnique || prop.type === generator_type_1.GDK_PROPERTY_TYPE.EMAIL) {
        contents.push('unique: true');
    }
    return contents.join('\n');
}
function _ResolveFileImports(schema) {
    var importCodes = [];
    var hasRefIdProps = schema.properties.filter(function (p) {
        return p.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID ||
            p.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_ID_ARRAY ||
            p.type === generator_type_1.GDK_PROPERTY_TYPE.REFERENCE_USER_ID;
    });
    var hasEnumProps = schema.properties.filter(function (p) { return p.type === generator_type_1.GDK_PROPERTY_TYPE.ENUM_OPTION; });
    if (hasRefIdProps.length > 0) {
        importCodes.push("import mongoose from 'mongoose';");
    }
    if (hasEnumProps.length > 0) {
        importCodes.push("import { EnumToArray } from '@shared/helper/helper';");
    }
    if (importCodes.length > 0) {
        return importCodes.join('\n');
    }
    else {
        return '';
    }
}
function _ResolvePropSingleIndex(schema) {
    var createIndexCodes = schema.properties.reduce(function (all, prop) {
        if (prop.isEnableMongoIndex && prop.type !== generator_type_1.GDK_PROPERTY_TYPE.DURATION) {
            all.push("".concat(schema.mongoSchemaRefName, ".index({ ").concat((0, help_1.KebabToCamelCase)(prop.name), ": 1 })"));
        }
        return all;
    }, []);
    if (schema.enableSoftDelete) {
        createIndexCodes.push("".concat(schema.mongoSchemaRefName, ".index({ ").concat((0, help_1.KebabToCamelCase)(generator_static_1.SOFT_DELETE_PROP_NAME), ": 1})"));
    }
    if (createIndexCodes.length > 0) {
        return createIndexCodes.join('\n');
    }
    else {
        return '';
    }
}

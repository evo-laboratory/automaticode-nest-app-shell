"use strict";
exports.__esModule = true;
var help_1 = require("../../utils/help");
var generator_type_1 = require("../../types/generator.type");
function GDKV1SchemaJSONFile(name) {
    var FileContent = {
        version: 1,
        name: name,
        defaultWriteRoles: '',
        defaultReadRoles: '',
        includeCreatedAt: false,
        includeUpdatedAt: false,
        enableSoftDelete: true,
        mongoEnableTextSearch: false,
        mongoTextSearchPropertyNames: '',
        properties: [
            {
                name: 'example(will be Prop name)',
                alias: '範例',
                descriptionNote: "(just a usage note for ".concat(name, ")"),
                type: (0, help_1.EnumToArray)(generator_type_1.GDK_PROPERTY_TYPE).join(' | '),
                isUnique: false,
                isRequired: false,
                isEnableMongoIndex: false,
                "default": '',
                referenceSchemaName: '(If type is REFERENCE_ID or REFERENCE_ID_LIST)',
                enumOptions: [],
                skipEnumSchemaPrefix: false,
                objectDefinition: {
                    name: '(objectDefinition use only when property type is OBJECT or ARRAY_OBJECT)',
                    alias: '範例2',
                    descriptionNote: "(just a usage note for ".concat(name, ")"),
                    type: (0, help_1.EnumToArray)(generator_type_1.GDK_PROPERTY_TYPE).join(' | '),
                    isRequired: true,
                    "default": '',
                    referenceSchemaName: '(If type is REFERENCE_ID or REFERENCE_ID_LIST)',
                    enumOptions: [],
                    skipEnumSchemaPrefix: false
                }
            },
        ],
        httpAccessEndpoints: []
    };
    return JSON.stringify(FileContent, null, 2);
}
exports["default"] = GDKV1SchemaJSONFile;

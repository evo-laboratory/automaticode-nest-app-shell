import { EnumToArray } from '../../utils/help';
import { GDKSchema, GDK_PROPERTY_TYPE } from '../../types/generator.type';

export default function GDKV1SchemaJSONFile(name: string) {
  const FileContent: GDKSchema<string> = {
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
        descriptionNote: `(just a usage note for ${name})`,
        type: EnumToArray(GDK_PROPERTY_TYPE).join(' | '),
        isUnique: false,
        isRequired: false,
        isEnableMongoIndex: false,
        default: '',
        referenceSchemaName: '(If type is REFERENCE_ID or REFERENCE_ID_LIST)',
        enumOptions: [],
        skipEnumSchemaPrefix: false,
        objectDefinition: {
          name: '(objectDefinition use only when property type is OBJECT or ARRAY_OBJECT)',
          alias: '範例2',
          descriptionNote: `(just a usage note for ${name})`,
          type: EnumToArray(GDK_PROPERTY_TYPE).join(' | '),
          isRequired: true,
          default: '',
          referenceSchemaName: '(If type is REFERENCE_ID or REFERENCE_ID_LIST)',
          enumOptions: [],
          skipEnumSchemaPrefix: false,
        },
      },
    ],
    httpAccessEndpoints: [],
  };
  return JSON.stringify(FileContent, null, 2);
}

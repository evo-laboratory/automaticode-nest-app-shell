import { HTTP_METHOD } from './common.type';

export interface GDKSchema<T extends string | GDK_PROPERTY_TYPE> {
  version: number;
  name: string;
  defaultWriteRoles: string; // * Use " " to separate roles, blank means public
  defaultReadRoles: string; // * Use " " to separate roles, blank means public
  includeCreatedAt: boolean; // * default false
  includeUpdatedAt: boolean; // * default false
  enableSoftDelete: boolean; // * default true
  mongoEnableTextSearch: boolean; // * default false // TODO
  mongoTextSearchPropertyNames: string; // * use " " to separate, only work when mongoEnableTextSearch is true // TODO
  properties: GDKSchemaProperty<T>[];
  httpAccessEndpoints: GDKSchemaHttpAccessEndpoint[]; // * TODO
}

export interface IProcessedGDKSchema extends GDKSchema<GDK_PROPERTY_TYPE> {
  hasMongoIndex: boolean;
  hasMongoRefProp: boolean;
  hasEnumOptions: boolean;
  kebabCaseName: string;
  camelCaseName: string;
  pascalCaseName: string;
  interfaceName: string;
  constantCaseName: string;
  apiConstantPathName: string;
  apiConstantPath: string;
  staticFileName: string;
  typeFileName: string;
  serviceFileName: string;
  controllerFileName: string;
  moduleFileName: string;
  mongoModelName: string;
  mongoModelRefName: string;
  mongoDocumentRefName: string;
  mongoSchemaRefName: string;
  createFullDtoName: string;
  createDtoFileName: string;
  updateFullDtoName: string;
  updateFullDtoFileName: string;
  createFullDtoInterfaceName: string;
  updateFullDtoInterfaceName: string;
  serviceName: string;
  controllerName: string;
  schemaFileName: string;
  moduleName: string;
}

export interface GDKSchemaProperty<T> {
  name: string;
  alias: string;
  descriptionNote: string;
  type: T;
  default?: any;
  isRequired?: boolean;
  isUnique?: boolean; // * default false, check when type is STRING or EMAIL, isRequired will be true
  isEnableMongoIndex?: boolean; // * default false, only works on first layer
  referenceSchemaName: string; // * If type is REFERENCE_ID or REFERENCE_ID_LIST
  enumOptions: string[]; // * If type is ENUM_OPTION
  skipEnumSchemaPrefix: boolean; // * If type is ENUM_OPTION, will skip add Schema name Prefix
  objectDefinition?: GDKSchemaProperty<T>; // * If type is OBJECT or ARRAY_OBJECT // * TODO
}

export interface GDKSchemaHttpAccessEndpoint {
  resourceAlias: string;
  httpMethod: HTTP_METHOD;
  isPublic: boolean; // * default false // * TODO
  accessRoles: string; // * use " " to separate, apply when isPublic is false // * TODO
  accessPropertyNames: string; // * use " " to separate // * TODO
  mongoPopulatePropertyNames: string; // * use " " to separate // * TODO
  summary: string; // * TODO
  queryByPropertyNames: string; // * use " " to separate, only work when GET PUT DELETE // * TODO
  isMany: boolean; // * TODO
  isCheckIdMatchWithAccessor: boolean;
  checkIdMatchWithAccessorPropertyName: string; // * When isCheckIdMatchWithAccessor is true
}

export enum GDK_PROPERTY_TYPE {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  REFERENCE_USER_ID = 'REFERENCE_USER_ID',
  REFERENCE_ID = 'REFERENCE_ID',
  REFERENCE_ID_ARRAY = 'REFERENCE_ID_ARRAY', // * TODO
  DATE = 'DATE',
  TIMESTAMP = 'TIMESTAMP',
  DURATION = 'DURATION',
  ENUM_OPTION = 'ENUM_OPTION',
  STRING_ARRAY = 'STRING_ARRAY',
  NUMBER_ARRAY = 'NUMBER_ARRAY',
  BOOLEAN_ARRAY = 'BOOLEAN_ARRAY',
  OBJECT = 'OBJECT', // * TODO
  ARRAY_OBJECT = 'ARRAY_OBJECT', // * TODO
  EMAIL = 'EMAIL',
  IMAGE_URL = 'IMAGE_URL',
  IMAGE_URL_ARRAY = 'IMAGE_URL_ARRAY',
  QUILL_RICH_TEXT_EDITOR = 'QUILL_RICH_TEXT_EDITOR',
}

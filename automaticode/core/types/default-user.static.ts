import { GDKSchema, GDK_PROPERTY_TYPE } from './generator.type';

export const DEFAULT_USER_SCHEMA: GDKSchema<GDK_PROPERTY_TYPE> = {
  version: 1,
  name: 'user',
  defaultWriteRoles: '',
  defaultReadRoles: '',
  includeCreatedAt: true,
  includeUpdatedAt: true,
  enableSoftDelete: true,
  mongoEnableTextSearch: false,
  mongoTextSearchPropertyNames: '',
  properties: [],
  httpAccessEndpoints: [],
};

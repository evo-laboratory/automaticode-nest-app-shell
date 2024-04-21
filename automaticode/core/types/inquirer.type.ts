export interface IInquirerPromptQuestions {
  type: INQUIRER_TYPE;
  name: string;
  message: string;
  choices?: string[];
  when?: any;
  default?: string;
}

export enum INQUIRER_TYPE {
  INPUT = 'input', // * default
  NUMBER = 'number',
  CONFIRM = 'confirm',
  LIST = 'list',
  RAW_LIST = 'rawlist',
  EXPAND = 'expand',
  CHECK_BOX = 'checkbox',
  PASSWORD = 'password',
  EDITOR = 'editor',
}

export enum CLI_ACTION {
  A_CREATE_SCHEMA = 'A) Create a new schema',
  B_SCAN_SCHEMAS = 'B) Scan current schemas',
  C_RUN_ALL_GENERATION = 'C) Generate GDK modules base on all Schemas',
  D_RUN_SINGLE_GENERATION = 'D) Generate GDK modules base on selected Schemas [IN DEVELOP]',
  E_RUN_SYNC_EXTRA_USER_AND_ROLE = 'E) Sync User and Role from automaticode.json Config.User',
}

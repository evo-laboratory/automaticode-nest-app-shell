import * as inquirer from 'inquirer';
import {
  CLI_ACTION,
  IInquirerPromptQuestions,
  INQUIRER_TYPE,
} from '../types/inquirer.type';
import { Q_ACTION, Q_SCHEMA_NAME } from './cli.static';
import { EnumToArray } from '../utils/help';
import { ReadSchemaDirectoryFileNames } from '../utils/file';
import CreateGDKSchemaJsonExec from './executors/create-gdk-schema-json.exec';
import GenerateGDKModulesExec from './executors/create-gdk-modules.exec';
import UserExtraSchemaAndRoleSyncExec from './executors/user-extra-and-role-sync.exec';
import ScanSchemas from './executors/scan-schema.exec';

const Inquirer = inquirer as any;

const START_QUESTIONS: IInquirerPromptQuestions[] = [
  {
    type: INQUIRER_TYPE.LIST,
    name: Q_ACTION,
    message: 'What do you want to do ?',
    choices: EnumToArray(CLI_ACTION),
  },
  {
    type: INQUIRER_TYPE.INPUT,
    name: Q_SCHEMA_NAME,
    message: 'Please enter schema name.',
    default: 'use-singular-kebab-case',
    when: (answers: any) => {
      return answers[Q_ACTION] === CLI_ACTION.A_CREATE_SCHEMA;
    },
  },
];

export default async function StartInquirer() {
  // * STEP 1. Read Schema Files
  const schemaJSONfileNames = await ReadSchemaDirectoryFileNames();
  Inquirer.prompt(START_QUESTIONS).then(async (answers: any) => {
    const selectedAction = answers[Q_ACTION];
    switch (selectedAction) {
      case CLI_ACTION.A_CREATE_SCHEMA:
        await CreateGDKSchemaJsonExec(answers);
        break;
      case CLI_ACTION.B_SCAN_SCHEMAS:
        await ScanSchemas();
        break;
      case CLI_ACTION.C_RUN_ALL_GENERATION:
        await GenerateGDKModulesExec();
        break;
      case CLI_ACTION.D_RUN_SINGLE_GENERATION:
        console.log(schemaJSONfileNames);
        break;
      case CLI_ACTION.E_RUN_SYNC_EXTRA_USER_AND_ROLE:
        await UserExtraSchemaAndRoleSyncExec();
        break;
      default:
        break;
    }
  });
}

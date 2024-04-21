import { CreateSchemaFile } from '../../utils/file';
import { Q_SCHEMA_NAME } from '../cli.static';

export default async function CreateGDKSchemaJsonExec(answers: any) {
  await CreateSchemaFile(answers[Q_SCHEMA_NAME]);
}

// * GDK Application Shell Default File
import { ModelDefinition } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export function MongoModelBuilder(
  modelName: string,
  schema: mongoose.Schema,
  options?: Pick<ModelDefinition, 'collection' | 'discriminators'>,
) {
  return {
    name: modelName,
    schema: schema,
    ...options,
  };
}

// * GDK Application Shell Default File
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ISwaggerSetupOption } from '@shared/swagger/swagger.type';

export const SWAGGER_DEFAULT_TITLE = 'NestJS Starter';
export const SWAGGER_DEFAULT_DESC = 'NestJS API Starter';
export const SWAGGER_DEFAULT_VER = '1.0';
export const SWAGGER_DEFAULT_PATH = 'swagger';

function SwaggerSetup(app: INestApplication, option?: ISwaggerSetupOption) {
  const swaggerDoc = new DocumentBuilder()
    .setTitle(option?.title || SWAGGER_DEFAULT_TITLE)
    .setDescription(option?.description || SWAGGER_DEFAULT_DESC)
    .setVersion(option?.version || SWAGGER_DEFAULT_VER)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerDoc);
  SwaggerModule.setup(option?.path || SWAGGER_DEFAULT_PATH, app, document);
}

export default SwaggerSetup;

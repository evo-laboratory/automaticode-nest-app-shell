"use strict";
exports.__esModule = true;
exports.GDKV1NestModuleFile = exports.MODULE_SUFFIX_NAME = void 0;
exports.MODULE_SUFFIX_NAME = 'module';
function GDKV1NestModuleFile(schema) {
    return "import { Module } from '@nestjs/common';\n  import { MongooseModule } from '@nestjs/mongoose';\n\n  import { ".concat(schema.mongoModelRefName, " } from './").concat(schema.schemaFileName, "';\n  import { ").concat(schema.pascalCaseName, "Controller } from './").concat(schema.controllerFileName, "';\n  import { ").concat(schema.pascalCaseName, "Service } from './").concat(schema.serviceFileName, "';\n\n  @Module({\n    imports: [\n      MongooseModule.forFeature([").concat(schema.mongoModelRefName, "]),\n    ],\n    controllers: [").concat(schema.pascalCaseName, "Controller],\n    providers: [").concat(schema.pascalCaseName, "Service],\n  })\n  export class ").concat(schema.pascalCaseName, "Module {}\n");
}
exports.GDKV1NestModuleFile = GDKV1NestModuleFile;

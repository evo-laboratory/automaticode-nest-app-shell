"use strict";
exports.__esModule = true;
function GDKV1GeneratedModuleListFile(schemas) {
    return "// * This files is maintained by GDK.\n  ".concat(_ResolveModuleImports(schemas), "\n\n  export const GENERATED_MODULES = [").concat(schemas
        .map(function (s) { return s.moduleName; })
        .join(',\n'), "];\n");
}
exports["default"] = GDKV1GeneratedModuleListFile;
function _ResolveModuleImports(schemas) {
    var importCodes = schemas.map(function (schema) {
        return "import { ".concat(schema.moduleName, " } from './").concat(schema.kebabCaseName, "/").concat(schema.moduleFileName, "';");
    });
    return importCodes.join('\n');
}

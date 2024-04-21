import { IProcessedGDKSchema } from '../../types/generator.type';

export default function GDKV1GeneratedModuleListFile(
  schemas: IProcessedGDKSchema[],
) {
  return `// * This files is maintained by GDK.
  ${_ResolveModuleImports(schemas)}

  export const GENERATED_MODULES = [${schemas
    .map((s) => s.moduleName)
    .join(',\n')}];
`;
}

function _ResolveModuleImports(schemas: IProcessedGDKSchema[]) {
  const importCodes = schemas.map((schema) => {
    return `import { ${schema.moduleName} } from './${schema.kebabCaseName}/${schema.moduleFileName}';`;
  });
  if (importCodes.length > 0) {
    return importCodes.join('\n');
  }
  return '';
}

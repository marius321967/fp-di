import { CompilerOptions, ModuleKind, ModuleResolutionKind } from 'typescript';

const MODULE_RESOLUTION_ESM: ModuleResolutionKind[] = [
  ModuleResolutionKind.Node16,
  ModuleResolutionKind.NodeNext,
  ModuleResolutionKind.Bundler,
];

const MODULE_RESOLUTION_COMMONJS: ModuleResolutionKind[] = [
  ModuleResolutionKind.Node10,
];

const MODULE_ESM: ModuleKind[] = [
  ModuleKind.Node16,
  ModuleKind.NodeNext,
  ModuleKind.ES2015,
  ModuleKind.ES2020,
  ModuleKind.ES2022,
  ModuleKind.ESNext,
  ModuleKind.System,
  ModuleKind.AMD,
  ModuleKind.UMD
];

export const decideModuleSystem = (
  compilerOptions: CompilerOptions,
  packageType: string | undefined,
): 'esm' | 'commonjs' => {
  if (compilerOptions.moduleResolution) {
    if (MODULE_RESOLUTION_ESM.includes(compilerOptions.moduleResolution)) {
      return 'esm';
    }

    if (MODULE_RESOLUTION_COMMONJS.includes(compilerOptions.moduleResolution)) {
      return 'commonjs';
    }

    throw new Error(
      `Could not determine module system from unrecognized compilerOptions.moduleResolution value [${compilerOptions.moduleResolution}]`,
    );
  }

  if (compilerOptions.module) {
    if (ModuleKind.)
  }

  // use package.json as fallback
};

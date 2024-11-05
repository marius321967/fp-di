import ts from 'typescript';
import { assertIsPresent } from '../helpers/assert';
import { isEntrypointExport } from '../node.type-guards';
import { FunctionLikeNode } from '../types';
import { ModuleMember } from './fills/structs';

export const findProgramEntrypoint = (
  program: ts.Program,
  entrypointFile: string,
): ModuleMember<FunctionLikeNode> | null => {
  const source = program.getSourceFile(entrypointFile);

  assertIsPresent(
    source,
    `Entrypoint file [${entrypointFile}] not found in program`,
  );

  let entrypointDeclaration: ModuleMember<FunctionLikeNode> | null = null;

  source.forEachChild((node) => {
    if (isEntrypointExport(node)) {
      entrypointDeclaration = {
        expression: node.expression,
        exportedAs: { type: 'default' },
        filePath: entrypointFile,
      };
    }
  });

  return entrypointDeclaration;
};

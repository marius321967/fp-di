import ts from 'typescript';
import { isEntrypointExport } from '../node.type-guards';
import { assertIsPresent } from '../tools';
import { ProgramEntrypointExport } from './structs';

export const findProgramEntrypoint = (
  program: ts.Program,
  entrypointFile: string,
): ProgramEntrypointExport | null => {
  const source = program.getSourceFile(entrypointFile);

  assertIsPresent(
    source,
    `Entrypoint file [${entrypointFile}] not found in program`,
  );

  let entrypointDeclaration: ts.ExportAssignment | null = null;

  source.forEachChild((node) => {
    if (isEntrypointExport(node)) {
      if (entrypointDeclaration) {
        throw new Error(
          `Multiple eligible program entrypoints found. First entrypoint: [${entrypointDeclaration.getText()}], current entrypoint: [${node.getText()}]`,
        );
      }

      entrypointDeclaration = node;
    }
  });

  return entrypointDeclaration;
};

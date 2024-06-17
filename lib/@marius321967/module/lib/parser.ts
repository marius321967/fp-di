import ts from 'typescript';
import {
  isEntrypointDeclaration,
  isExportedTypeDeclaration,
  isExportedVariableDeclaration,
} from './helpers';
import {
  IdentifierMap,
  combineSymbolMaps,
  createSymbolMap,
} from './symbol-map';
import { registerTypeDeclaration, registerValueDeclarations } from './tools';
import { ValueMap, combineValueMaps, createValueMap } from './value-map';

export type FileParseResult = {
  identifiers: IdentifierMap;
  values: ValueMap;
};

export type ParseResult = {
  entrypoint: ts.ExportAssignment;
  identifiers: IdentifierMap;
  values: ValueMap;
};

export const findProgramEntrypoint = (
  program: ts.Program,
  entrypointFile: string,
): ts.ExportAssignment | null => {
  const source = program.getSourceFile(entrypointFile);

  if (!source) {
    throw new Error('No source');
  }

  let entrypointDeclaration: ts.ExportAssignment | null = null;

  source.forEachChild((node) => {
    if (isEntrypointDeclaration(node)) {
      entrypointDeclaration = node;
    }
  });

  return entrypointDeclaration;
};

export const parseProgram = (
  programFiles: string[],
  entrypointFile: string,
  program: ts.Program,
): ParseResult => {
  const { identifiers, values } = programFiles.reduce(
    programParseReducer(program),
    { identifiers: [] as IdentifierMap, values: [] as ValueMap },
  );

  const entrypointDeclaration = findProgramEntrypoint(program, entrypointFile);

  if (!entrypointDeclaration) {
    throw new Error(
      'No entrypoint found. Must be arrow function exported as default.',
    );
  }

  return {
    entrypoint: entrypointDeclaration,
    identifiers,
    values,
  };
};

export const programParseReducer =
  (program: ts.Program) =>
  (acc: ParseResult, path: string): FileParseResult => {
    const result = parseFile(path, program);

    return {
      identifiers: combineSymbolMaps(acc.identifiers, result.identifiers),
      values: combineValueMaps(acc.values, result.values),
    };
  };

export const parseFile = (
  path: string,
  program: ts.Program,
): FileParseResult => {
  const source = program.getSourceFile(path);

  if (!source) {
    throw new Error(`Source file [${path}] not found`);
  }

  const symbolMap = createSymbolMap();
  const valueMap = createValueMap();

  source.forEachChild((node) => {
    if (isExportedTypeDeclaration(node)) {
      registerTypeDeclaration(
        node,
        program.getTypeChecker(),
        symbolMap.addSymbol,
      );
    }

    if (isExportedVariableDeclaration(node)) {
      registerValueDeclarations(
        node,
        program.getTypeChecker(),
        valueMap.addValue,
      );
    }
  });

  return {
    identifiers: symbolMap.getIdentifiers(),
    values: valueMap.getValues(),
  };
};

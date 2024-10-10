import ts, { TypeReferenceNode } from 'typescript';
import { assertIsPresent } from '../helpers/assert';
import { getSymbolAtLocation } from '../helpers/symbols';
import {
  BlueprintAdder,
  combineBlueprintRepositories,
  createBlueprintRepository,
} from '../repositories/blueprints';
import {
  combineValueRepositories,
  createValueRepository,
  ValueAdder,
} from '../repositories/values';
import { findProgramEntrypoint } from './findProgramEntrypoint';
import { isEligibleValue } from './isEligibleValue';
import { parseFile } from './parseFile';
import { ParseResult, ParserSet } from './structs';
import { valueDeclarationRegistrator } from './valueDeclarationRegistrator';

export const parseProgram = (
  programFiles: string[],
  entrypointFile: string,
  program: ts.Program,
): ParseResult => {
  const { blueprints, values } = programFiles.reduce(
    programParseReducer(program),
    {
      blueprints: createBlueprintRepository(program.getTypeChecker()),
      values: createValueRepository(program.getTypeChecker()),
    },
  );

  const entrypointExport = findProgramEntrypoint(program, entrypointFile);

  assertIsPresent(
    entrypointExport,
    'No entrypoint found. Must be arrow function exported as default.',
  );

  return {
    entrypointExport,
    blueprints,
    values,
  };
};

export const programParseReducer =
  (program: ts.Program) =>
  (acc: ParseResult, path: string): ParserSet => {
    const result = parseFile(path, program);

    return {
      blueprints: combineBlueprintRepositories(
        acc.blueprints,
        result.blueprints,
      ),
      values: combineValueRepositories(acc.values, result.values),
    };
  };

export const registerTypeDeclaration = (
  node: ts.TypeAliasDeclaration,
  typeChecker: ts.TypeChecker,
  addBlueprint: BlueprintAdder,
): void => {
  addBlueprint(
    getSymbolAtLocation(node.name, typeChecker),
    node.name.getText(),
    node.getSourceFile().fileName,
  );
};

export const registerEligibleValueDeclarations = (
  node: ts.VariableStatement,
  typeChecker: ts.TypeChecker,
  addValue: ValueAdder,
): void => {
  node.declarationList.declarations
    .filter(isEligibleValue)
    .forEach(valueDeclarationRegistrator(addValue, typeChecker));
};

export const registerValueDeclaration = (
  node: ts.VariableDeclaration & { type: TypeReferenceNode },
  typeChecker: ts.TypeChecker,
  addValue: ValueAdder,
): void => valueDeclarationRegistrator(addValue, typeChecker)(node);

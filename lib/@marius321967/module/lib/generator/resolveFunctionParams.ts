import ts from 'typescript';
import { Blueprint, BlueprintGetter } from '../repositories/blueprints';
import { ValueGetter, ValueMapEntry } from '../repositories/values';
import { assertIsPresent } from '../tools';
import { resolveValueFromCandidateBlueprints } from './resolveValueFromCandidateBlueprints';
import { resolveTypeNodeSymbols } from './symbols';

/** @returns Length same as functionNode.parameters. Each param may have multiple candidates in case of UnionType. */
export const resolveFunctionParamBlueprints = (
  functionNode: ts.SignatureDeclarationBase,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): Blueprint[][] => {
  return functionNode.parameters.map((parameter) => {
    const typeNode = parameter.type;

    assertIsPresent(typeNode, `Parameter [${parameter.getText()}] has no type`);

    const typeSymbols = resolveTypeNodeSymbols(typeNode, typeChecker);

    const blueprints = typeSymbols.map((typeSymbol) => {
      const blueprint = getBlueprint(typeSymbol);
      assertIsPresent(
        blueprint,
        `Type declaration not found for symbol [${typeSymbol.escapedName}]`,
      );

      return blueprint;
    });

    return blueprints;
  });
};

/** @returns Resolved values to fill in for params */
export const resolveFunctionParams = (
  functionNode: ts.SignatureDeclarationBase,
  typeChecker: ts.TypeChecker,
  getSymbol: BlueprintGetter,
  getValue: ValueGetter,
): ValueMapEntry[] => {
  const params = resolveFunctionParamBlueprints(
    functionNode,
    typeChecker,
    getSymbol,
  );

  return params.map((paramCandidates, paramIndex) => {
    const value = resolveValueFromCandidateBlueprints(
      paramCandidates,
      getValue,
    );

    assertIsPresent(
      value,
      `Could not resolve value for type [${functionNode.parameters[paramIndex].getText()}]`,
    );

    return value;
  });
};

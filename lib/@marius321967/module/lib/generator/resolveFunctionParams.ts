import ts from 'typescript';
import { Blueprint, BlueprintGetter } from '../repositories/blueprints';
import { ValueGetter, ValueMapEntry } from '../repositories/values';
import { assertIsPresent } from '../tools';
import { resolveTypeNodeSymbol } from './symbols';

/** @returns Length same as functionNode.parameters */
export const resolveFunctionParamBlueprints = (
  functionNode: ts.SignatureDeclarationBase,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): Blueprint[] => {
  return functionNode.parameters.map((parameter) => {
    const typeNode = parameter.type;

    if (!typeNode || !ts.isTypeReferenceNode(typeNode)) {
      throw new Error(
        `Unable to resolve type [${typeNode?.getText()}] for argument [${parameter.name.getText()}]`,
      );
    }

    const symbol = resolveTypeNodeSymbol(typeNode, typeChecker);
    const blueprint = getBlueprint(symbol);

    assertIsPresent(
      blueprint,
      `Type declaration not found for symbol [${symbol.escapedName}]`,
    );

    return blueprint;
  });
};

/** @returns Resolved values to fill in for params */
export const resolveFunctionParams = (
  functionNode: ts.SignatureDeclarationBase,
  typeChecker: ts.TypeChecker,
  getSymbol: BlueprintGetter,
  getValue: ValueGetter,
): ValueMapEntry[] => {
  const blueprints = resolveFunctionParamBlueprints(
    functionNode,
    typeChecker,
    getSymbol,
  );

  return blueprints.map((blueprint) => {
    const value = getValue(blueprint.originalSymbol);

    assertIsPresent(
      value,
      `Value not found for type [${blueprint.originalSymbol.getName()}]`,
    );

    return value;
  });
};

import ts from 'typescript';
import { BlueprintGetter } from '../repositories/blueprints';
import { ValueGetter, ValueMapEntry } from '../repositories/values';
import { resolveTypeNodeSymbol } from './symbols';

/** @returns Length same as functionNode.parameters */
export const resolveFunctionParamTypeSymbols = (
  functionNode: ts.SignatureDeclarationBase,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): ts.Symbol[] => {
  return functionNode.parameters.map((parameter) => {
    const typeNode = parameter.type;

    if (!typeNode || !ts.isTypeReferenceNode(typeNode)) {
      throw new Error(
        `Unable to resolve type [${typeNode?.getText()}] for argument [${parameter.name.getText()}]`,
      );
    }

    const symbol = resolveTypeNodeSymbol(typeNode, typeChecker);
    const blueprint = getBlueprint(symbol);

    if (!blueprint) {
      throw new Error(
        `Type declaration not found for symbol [${symbol.escapedName}]`,
      );
    }

    return blueprint.originalSymbol;
  });
};

export const resolveFunctionParams = (
  functionNode: ts.SignatureDeclarationBase,
  typeChecker: ts.TypeChecker,
  getSymbol: BlueprintGetter,
  getValue: ValueGetter,
): ValueMapEntry[] => {
  const paramTypeSymbols = resolveFunctionParamTypeSymbols(
    functionNode,
    typeChecker,
    getSymbol,
  );

  return paramTypeSymbols.map((paramType) => {
    const valueDeclaration = getValue(paramType);

    if (!valueDeclaration) {
      throw new Error(`Value not found for type [${paramType.name}]`);
    }

    return valueDeclaration;
  });
};

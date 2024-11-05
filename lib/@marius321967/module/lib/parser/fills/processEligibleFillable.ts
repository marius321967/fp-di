import ts from 'typescript';
import { toAcceptedTypes } from '../../generator/fills/toAcceptedTypes';
import { resolveValueFromCandidateSymbols } from '../../generator/resolveValueFromCandidateSymbols';
import { assertIsPresent } from '../../helpers/assert';
import { symbolAtLocationGetter } from '../../helpers/symbols';
import { Value, ValueGetter } from '../../repositories/values';
import { FunctionLikeNode } from '../../types';
import { EligibleFillable, TypedFunctionFill } from './structs';

export const processEligibleFillable = (
  { declarationNode, initializerNode, blueprints }: EligibleFillable,
  typeChecker: ts.TypeChecker,
  getValue: ValueGetter,
): TypedFunctionFill => {
  const values = resolveFunctionParameterValues(
    initializerNode,
    typeChecker,
    getValue,
  );

  const exportIdentifier = declarationNode.name;

  if (!ts.isIdentifier(exportIdentifier)) {
    throw new Error(
      `Binding pattern value declarations not yet supported (eg., [${exportIdentifier.getText()}])`,
    );
  }

  return {
    target: {
      expression: initializerNode,
      filePath: declarationNode.getSourceFile().fileName,
      exportedAs: {
        type: 'named',
        identifierNode: exportIdentifier,
        name: exportIdentifier.getText(),
      },
    },
    values,
    blueprints,
  };
};

export const resolveFunctionParameterValues = (
  functionNode: FunctionLikeNode,
  typeChecker: ts.TypeChecker,
  getValue: ValueGetter,
): Value[] =>
  functionNode.parameters
    .map((parameter) => {
      const parameterType = parameter.type;
      assertIsPresent(
        parameterType,
        `Cannot fill function with typeless parameter [${parameter.getText()}]`,
      );

      return toAcceptedTypes(parameterType)
        .map(({ typeName }) => typeName)
        .map(symbolAtLocationGetter(typeChecker));
    })
    .map((typeSymbols, index) => {
      const value = resolveValueFromCandidateSymbols(typeSymbols, getValue);

      assertIsPresent(
        value,
        `Could not resolve value for function parameter [${functionNode.parameters[index].getText()}]`,
      );

      return value;
    });

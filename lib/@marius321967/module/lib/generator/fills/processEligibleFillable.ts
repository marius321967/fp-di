import ts from 'typescript';
import { assertIsPresent } from '../../helpers/assert';
import { symbolAtLocationGetter } from '../../helpers/symbols';
import { Value, ValueGetter } from '../../repositories/values';
import { FunctionLikeNode } from '../../types';
import { resolveValueFromCandidateSymbols } from '../resolveValueFromCandidateSymbols';
import { FilledFunction } from './structs';
import { toAcceptedTypes } from './toAcceptedTypes';
import { EligibleFillable } from './tryExtractEligibleFillable';

export const processEligibleFillable = (
  { declarationNode, initializerNode, blueprints }: EligibleFillable,
  typeChecker: ts.TypeChecker,
  getValue: ValueGetter,
): FilledFunction => {
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
    exportedAs: exportIdentifier.getText(),
    exportIdentifier: exportIdentifier,
    functionNode: initializerNode,
    parameterValues: values,
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

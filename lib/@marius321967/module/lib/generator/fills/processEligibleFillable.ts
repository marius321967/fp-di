import ts from 'typescript';
import { ValueGetter, ValueMapEntry } from '../../repositories/values';
import { assertIsPresent, symbolAtLocationGetter } from '../../tools';
import { resolveValueFromCandidateSymbols } from '../resolveValueFromCandidateSymbols';
import { toAcceptedTypes } from './toAcceptedTypes';

export type FilledFunction = {
  functionNode: ts.ArrowFunction;
  parameterValues: ValueMapEntry[];
};

export const processEligibleFillable = (
  functionNode: ts.ArrowFunction,
  typeChecker: ts.TypeChecker,
  getValue: ValueGetter,
): FilledFunction => {
  const values = resolveFunctionParameterValues(
    functionNode,
    typeChecker,
    getValue,
  );

  return {
    functionNode,
    parameterValues: values,
  };
};

export const resolveFunctionParameterValues = (
  functionNode: ts.ArrowFunction,
  typeChecker: ts.TypeChecker,
  getValue: ValueGetter,
): ValueMapEntry[] =>
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

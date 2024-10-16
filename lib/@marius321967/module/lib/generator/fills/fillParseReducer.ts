import ts from 'typescript';
import { ParseResult } from '../../parser/structs';
import { eligibleFillableFilter } from './isEligibleFillable';
import { processEligibleFillable } from './processEligibleFillable';
import { FilledFunction } from './structs';

export const fillParseReducer =
  (typeChecker: ts.TypeChecker, parseResult: ParseResult) =>
  (fills: FilledFunction[], node: ts.Node): FilledFunction[] => {
    if (!ts.isVariableStatement(node)) {
      return fills;
    }

    const newFills = node.declarationList.declarations
      .filter(
        eligibleFillableFilter(
          typeChecker,
          parseResult.blueprints.getBlueprint,
        ),
      )
      .map((declaration) =>
        processEligibleFillable(
          declaration,
          typeChecker,
          parseResult.values.getValue,
        ),
      );

    return [...fills, ...newFills];
  };

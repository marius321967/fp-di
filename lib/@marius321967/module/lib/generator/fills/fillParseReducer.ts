import ts from 'typescript';
import { ParseResult } from '../../parser/structs';
import { BlueprintGetter } from '../../repositories/blueprints';
import { processEligibleFillable } from './processEligibleFillable';
import { FilledFunction } from './structs';
import {
  EligibleFillable,
  tryExtractEligibleFillabe,
} from './tryExtractEligibleFillable';

export const eligibleFillableExtrator =
  (typeChecker: ts.TypeChecker, getBlueprint: BlueprintGetter) =>
  (
    eligibleFillables: EligibleFillable[],
    declarationNode: ts.VariableDeclaration,
  ): EligibleFillable[] => {
    const eligibleFillable = tryExtractEligibleFillabe(
      declarationNode,
      typeChecker,
      getBlueprint,
    );

    return eligibleFillable
      ? [...eligibleFillables, eligibleFillable]
      : eligibleFillables;
  };

export const fillParseReducer =
  (typeChecker: ts.TypeChecker, parseResult: ParseResult) =>
  (fills: FilledFunction[], node: ts.Node): FilledFunction[] => {
    if (!ts.isVariableStatement(node)) {
      return fills;
    }

    const newFills = node.declarationList.declarations
      .reduce(
        eligibleFillableExtrator(
          typeChecker,
          parseResult.blueprints.getBlueprint,
        ),
        [],
      )
      .map((fillable) =>
        processEligibleFillable(
          fillable,
          typeChecker,
          parseResult.values.getValue,
        ),
      );

    return [...fills, ...newFills];
  };

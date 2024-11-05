import ts from 'typescript';
import { BlueprintGetter } from '../../repositories/blueprints';
import { DependencyContext } from '../structs';
import { processEligibleFillable } from './processEligibleFillable';
import { EligibleFillable, TypedFunctionFill } from './structs';
import { tryExtractEligibleFillabe } from './tryExtractEligibleFillable';

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
  (typeChecker: ts.TypeChecker, context: DependencyContext) =>
  (fills: TypedFunctionFill[], node: ts.Node): TypedFunctionFill[] => {
    if (!ts.isVariableStatement(node)) {
      return fills;
    }

    const newFills = node.declarationList.declarations
      .reduce(
        eligibleFillableExtrator(typeChecker, context.blueprints.getBlueprint),
        [],
      )
      .map((fillable) =>
        processEligibleFillable(fillable, typeChecker, context.values.getValue),
      );

    return [...fills, ...newFills];
  };

import ts from 'typescript';
import {
  isDefaultExportDeclaration,
  isExportedVariableDeclaration,
  isFunctionLikeNode,
} from '../../node.type-guards';
import { BlueprintGetter } from '../../repositories/blueprints';
import { FunctionLikeNode } from '../../types';
import { TypedEligibleFillable, TypedEligibleFillableMember } from './structs';
import {
  exportAssignmentToExportAs,
  probeDefaultExportForEligibleFillable,
  probeNamedExportsForEligibleFillable,
} from './tryExtractEligibleFillable';

export const fileEligibleFillableReducer =
  (program: ts.Program, getBlueprint: BlueprintGetter) =>
  (
    acc: TypedEligibleFillableMember[],
    node: ts.Node,
  ): TypedEligibleFillableMember[] => {
    // export const x = ...;
    if (isExportedVariableDeclaration(node)) {
      const eligibleFillableMembers = probeNamedExportsForEligibleFillable(
        node,
        program.getTypeChecker(),
        getBlueprint,
      ).filter(
        (eligibleFillable): eligibleFillable is TypedEligibleFillableMember =>
          !!eligibleFillable.blueprints,
      );

      return [...acc, ...eligibleFillableMembers];
    }

    // export default ...;
    if (isDefaultExportDeclaration(node)) {
      const eligibleFillable = probeDefaultExportForEligibleFillable(
        node,
        program.getTypeChecker(),
        getBlueprint,
      );

      return eligibleFillable &&
        eligibleFillable.blueprints &&
        isFunctionLikeNode(node.expression)
        ? [
            ...acc,
            {
              ...(eligibleFillable as TypedEligibleFillable),
              exportedAs: {
                expression: node.expression as FunctionLikeNode,
                exportedAs: exportAssignmentToExportAs(),
                filePath: node.getSourceFile().fileName,
              },
            },
          ]
        : acc;
    }

    return acc;
  };

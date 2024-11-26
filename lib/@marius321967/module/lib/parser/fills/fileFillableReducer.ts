import ts from 'typescript';
import {
  isDefaultExportDeclaration,
  isExportedVariableDeclaration,
  isFunctionLikeNode,
} from '../../node.type-guards.js';
import { BlueprintGetter } from '../../repositories/blueprints.js';
import { FunctionLikeNode } from '../../types.js';
import { TypedFillable, TypedFillableMember } from './structs.js';
import {
  exportAssignmentToExportAs,
  probeDefaultExportForFillable,
  probeNamedExportsForFillable,
} from './tryExtractFillable.js';

export const fileFillableReducer =
  (program: ts.Program, getBlueprint: BlueprintGetter) =>
  (acc: TypedFillableMember[], node: ts.Node): TypedFillableMember[] => {
    // export const x = ...;
    if (isExportedVariableDeclaration(node)) {
      const fillableMembers = probeNamedExportsForFillable(
        node,
        program.getTypeChecker(),
        getBlueprint,
      ).filter(
        (fillable): fillable is TypedFillableMember => !!fillable.blueprints,
      );

      return [...acc, ...fillableMembers];
    }

    // export default ...;
    if (isDefaultExportDeclaration(node)) {
      const fillable = probeDefaultExportForFillable(
        node,
        program.getTypeChecker(),
        getBlueprint,
      );

      return fillable &&
        fillable.blueprints &&
        isFunctionLikeNode(node.expression)
        ? [
            ...acc,
            {
              ...(fillable as TypedFillable),
              member: {
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

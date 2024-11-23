import ts from 'typescript';
import { excludeNull } from '../../helpers/structs';
import { isFunctionLikeNode } from '../../node.type-guards';
import { BlueprintGetter } from '../../repositories/blueprints';
import { ExportAs } from '../../types';
import { matchParametersBlueprints, tryExtractBlueprints } from './blueprints';
import { Fillable, FillableMember } from './structs';

export const probeNamedExportForFillable = (
  node: ts.VariableDeclaration,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): Fillable | null => {
  // TODO remove double-check for function here and in probeFillable
  if (!node.initializer || !ts.isArrowFunction(node.initializer)) {
    return null;
  }

  return probeFillable(node.initializer, typeChecker, getBlueprint);
};

export const probeNamedExportsForFillable = (
  node: ts.VariableStatement,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): FillableMember[] => {
  return node.declarationList.declarations
    .map<FillableMember | null>((declaration) => {
      const fillable = probeNamedExportForFillable(
        declaration,
        typeChecker,
        getBlueprint,
      );

      if (
        !fillable ||
        !declaration.initializer ||
        !isFunctionLikeNode(declaration.initializer)
      )
        return null;

      return {
        ...fillable,
        member: {
          expression: declaration.initializer,
          exportedAs: variableDeclarationToExportAs(declaration),
          filePath: node.getSourceFile().fileName,
        },
      };
    })
    .filter(excludeNull);
};

export const probeDefaultExportForFillable = (
  node: ts.ExportAssignment,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): Fillable | null => {
  // TODO remove double-check for function here and in probeFillable
  if (!node.expression || !ts.isArrowFunction(node.expression)) {
    return null;
  }

  return probeFillable(node.expression, typeChecker, getBlueprint);
};

/**
 * Investigate expression and return parsed information if node is a function that can be filled by dependency injection.
 * @todo TODO handle function x() {}
 */
export const probeFillable = (
  expression: ts.Node,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): Omit<FillableMember, 'member'> | null => {
  if (!ts.isArrowFunction(expression)) {
    return null;
  }

  const functionNode = expression;

  const parameters = matchParametersBlueprints(
    functionNode.parameters,
    typeChecker,
    getBlueprint,
  );

  if (!parameters) {
    return null;
  }

  if (!functionNode.type) {
    return { parameters: parameters };
  }

  const blueprints = tryExtractBlueprints(
    functionNode.type,
    typeChecker,
    getBlueprint,
  );

  return blueprints
    ? {
        parameters: parameters,
        blueprints,
      }
    : { parameters: parameters };
};

export const variableDeclarationToExportAs = (
  node: ts.VariableDeclaration,
): ExportAs => {
  if (!ts.isIdentifier(node.name)) {
    throw new Error(`Node [${node.name.getText()}] is not an identifier`);
  }

  return { type: 'named', name: node.name.getText() };
};

export const exportAssignmentToExportAs = (): ExportAs => ({
  type: 'default',
});

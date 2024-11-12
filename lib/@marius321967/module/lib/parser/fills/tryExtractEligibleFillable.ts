import ts from 'typescript';
import { excludeNull } from '../../helpers/structs';
import { isFunctionLikeNode } from '../../node.type-guards';
import { BlueprintGetter } from '../../repositories/blueprints';
import { ExportAs } from '../../types';
import { matchParametersBlueprints, tryExtractBlueprints } from './blueprints';
import { EligibleFillable, EligibleFillableMember } from './structs';

export const probeNamedExportForEligibleFillable = (
  node: ts.VariableDeclaration,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): EligibleFillable | null => {
  // TODO remove double-check for function here and in probeEligibleFillable
  if (!node.initializer || !ts.isArrowFunction(node.initializer)) {
    return null;
  }

  return probeEligibleFillable(node.initializer, typeChecker, getBlueprint);
};

export const probeNamedExportsForEligibleFillable = (
  node: ts.VariableStatement,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): EligibleFillableMember[] => {
  return node.declarationList.declarations
    .map<EligibleFillableMember | null>((declaration) => {
      const fillable = probeNamedExportForEligibleFillable(
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
        exportedAs: {
          expression: declaration.initializer,
          exportedAs: variableDeclarationToExportAs(declaration),
          filePath: node.getSourceFile().fileName,
        },
      };
    })
    .filter(excludeNull);
};

export const probeDefaultExportForEligibleFillable = (
  node: ts.ExportAssignment,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): EligibleFillable | null => {
  // TODO remove double-check for function here and in probeEligibleFillable
  if (!node.expression || !ts.isArrowFunction(node.expression)) {
    return null;
  }

  return probeEligibleFillable(node.expression, typeChecker, getBlueprint);
};

/**
 * Investigate expression and return parsed information if node is a function that can be filled by dependency injection.
 * @todo TODO handle function x() {}
 */
export const probeEligibleFillable = (
  expression: ts.Node,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): Omit<EligibleFillableMember, 'exportedAs'> | null => {
  if (!ts.isArrowFunction(expression)) {
    return null;
  }

  const functionNode = expression;

  const parameterBlueprints = matchParametersBlueprints(
    functionNode.parameters,
    typeChecker,
    getBlueprint,
  );

  if (!parameterBlueprints) {
    return null;
  }

  if (!functionNode.type) {
    return { parameterBlueprints };
  }

  const blueprints = tryExtractBlueprints(
    functionNode.type,
    typeChecker,
    getBlueprint,
  );

  return blueprints
    ? {
        parameterBlueprints: parameterBlueprints,
        blueprints,
      }
    : { parameterBlueprints };
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

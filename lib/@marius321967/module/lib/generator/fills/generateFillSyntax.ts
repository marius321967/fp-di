import ts from 'typescript';
import {
  importBlueprint,
  importValue,
  orderImportFromTo,
  orderImportTo,
} from '../../imports';
import { FunctionFill, FunctionFillMember } from '../../parser/fills/structs';
import { FunctionLikeNode, ModuleMember } from '../../types';
import { getMemberImportIdentifier } from '../getDefaultImportName';
import {
  createImportDeclaration,
  createIntersectionTypeFromBlueprints,
  createNamedImportClause,
  createSingleExportStatement,
} from '../node-builders';
import { FillSyntax } from '../structs';
import {
  generateFillableDefaultImportIdentifier,
  generateFillName,
} from './fill-naming';

/**
 * Generate AST nodes for a fill file
 * @returns Export statement of function fill; import statements for function being filled and fill Values
 */
export const generateFillSyntax = (
  fill: FunctionFillMember,
  fillModulePath: string,
): FillSyntax => {
  const fulfilledBlueprintType = fill.blueprints
    ? createIntersectionTypeFromBlueprints(fill.blueprints)
    : undefined;

  const functionExportNode = createSingleExportStatement(
    generateFillName(fill.target.exportedAs),
    fill.exportedAs.expression,
    fulfilledBlueprintType,
  );

  const valueImports = fill.values.map((value) =>
    importValue(value, fillModulePath),
  );

  const blueprintImports = fill.blueprints
    ? fill.blueprints.map((blueprint) =>
        importBlueprint(blueprint, fillModulePath),
      )
    : [];

  const filledFunctionImport = importFillable(fill.target, fillModulePath);

  return {
    fillExportNode: functionExportNode,
    importNodes: [filledFunctionImport, ...valueImports, ...blueprintImports],
  };
};

export const createFillInitializer = ({
  target,
  values,
}: FunctionFill): ts.CallExpression => {
  const importedFillableIdentifier =
    target.exportedAs.type === 'default'
      ? generateFillableDefaultImportIdentifier()
      : target.exportedAs.identifierNode;

  return ts.factory.createCallExpression(
    importedFillableIdentifier,
    undefined,
    values.map((value) => getMemberImportIdentifier(value.member)),
  );
};

export const importFillable = (
  fillable: ModuleMember<FunctionLikeNode>,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder =
    fillable.exportedAs.type === 'default'
      ? orderImportFromTo(
          generateFillableDefaultImportIdentifier(),
          fillable.expression.getSourceFile().fileName,
          importTo,
        )
      : orderImportTo(fillable.exportedAs.identifierNode, importTo);

  return createImportDeclaration(
    createNamedImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};

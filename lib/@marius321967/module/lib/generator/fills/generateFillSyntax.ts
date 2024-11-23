import { FunctionFillMember } from '../../parser/fills/structs';
import {
  createIntersectionTypeFromBlueprints,
  createSingleExportStatement,
} from '../node-builders';
import { FillSyntax } from '../structs';
import { generateFillName } from './fill-naming';
import { generateFillImports } from './generateFillImports';

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
    fill.member.expression,
    fulfilledBlueprintType,
  );

  return {
    fillExportNode: functionExportNode,
    importNodes: generateFillImports(fill, fillModulePath),
  };
};

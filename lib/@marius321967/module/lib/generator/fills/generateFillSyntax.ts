import { FunctionFillMember } from '../../parser/fills/structs.js';
import {
  createIntersectionTypeFromBlueprints,
  createSingleExportStatement,
} from '../node-builders.js';
import { FillSyntax } from '../structs.js';
import { generateFillName } from './fill-naming.js';
import { generateFillImports } from './generateFillImports.js';

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

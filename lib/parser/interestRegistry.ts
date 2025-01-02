import ts from 'typescript';
import {
  isDefaultExportDeclaration,
  isExportedVariableDeclaration,
  isNamedExportDeclaration,
} from '../node.type-guards.js';
import { evaluateDefaultExport } from './evaluateDefaultExport.js';
import { Interest } from './interest.js';
import { isEligibleBlueprint } from './isEligibleBlueprint.js';
import { processNamedExportDeclaration } from './namedExportElementEvaluator.js';
import { registerEligibleValueDeclarations } from './registerEligibleValueDeclarations.js';
import { registerTypeDeclaration } from './registerTypeDeclaration.js';

// export type Foo = string | number;
const blueprintExportInterest: Interest<ts.TypeAliasDeclaration> = [
  isEligibleBlueprint,
  registerTypeDeclaration,
];

// export const x: Foo = 'foo';
const exportedVariableDeclarationInterest: Interest<ts.VariableStatement> = [
  isExportedVariableDeclaration,
  registerEligibleValueDeclarations,
];

// export {x, y};
const namedExportDeclarationInterest: Interest<
  ts.ExportDeclaration & { exportClause: ts.NamedExports }
> = [isNamedExportDeclaration, processNamedExportDeclaration];

// export default x;
const defaultExportDeclarationInterest: Interest<ts.ExportAssignment> = [
  isDefaultExportDeclaration,
  evaluateDefaultExport,
];

export const ROOT_NODE_INTERESTS: Interest<any>[] = [
  blueprintExportInterest,
  exportedVariableDeclarationInterest,
  namedExportDeclarationInterest,
  defaultExportDeclarationInterest,
];

import ts from 'typescript';
import {
  isDefaultExportDeclaration,
  isExportedVariableDeclaration,
  isNamedExportDeclaration,
} from '../node.type-guards';
import { evaluateDefaultExport } from './evaluateDefaultExport';
import { Interest } from './interest';
import { isEligibleBlueprint } from './isEligibleBlueprint';
import { processNamedExportDeclaration } from './namedExportElementEvaluator';
import { registerEligibleValueDeclarations } from './registerEligibleValueDeclarations';
import { registerTypeDeclaration } from './registerTypeDeclaration';

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

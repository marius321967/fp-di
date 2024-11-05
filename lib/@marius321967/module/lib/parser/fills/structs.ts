import ts from 'typescript';
import { Value } from '../../repositories/values';
import { Blueprints, ExportAs, FunctionLikeNode } from '../../types';

export type ModuleMember<T> = {
  filePath: string;
  exportedAs: ExportAs;
  expression: T;
};

export type FunctionFill = {
  values: Value[];
  target: ModuleMember<FunctionLikeNode>;
  /** Blueprints that the function return will satisfy. Extracted from target.expression.type */
  blueprints?: Blueprints;
};

export type TypedFunctionFill = Omit<FunctionFill, 'blueprints'> & {
  /** Blueprints that the function return will satisfy. Extracted from target.expression.type */
  blueprints: Blueprints;
};

export type EligibleFillable = {
  declarationNode: ts.VariableDeclaration;
  initializerNode: FunctionLikeNode;
  /** Blueprints matching initializerNode.type. */
  blueprints: Blueprints;
  /** Extracted blueprints for each item in initializerNode.parameters */
  parameterBlueprints: Blueprints[];
};

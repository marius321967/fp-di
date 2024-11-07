import ts from 'typescript';
import { Value } from '../../repositories/values';
import { Blueprints, FunctionLikeNode, ModuleMember } from '../../types';

export type FunctionFill = {
  values: Value[];
  target: ModuleMember<FunctionLikeNode>;
  /** Blueprints that the function return will satisfy. Extracted from target.expression.type */
  blueprints?: Blueprints;
};

export type TypedFunctionFill = Required<FunctionFill>;

export type EligibleFillable = {
  declarationNode: ts.VariableDeclaration;
  initializerNode: FunctionLikeNode;
  /** Blueprints matching initializerNode.type. */
  blueprints: Blueprints;
  /** Extracted blueprints for each item in initializerNode.parameters */
  parameterBlueprints: Blueprints[];
};

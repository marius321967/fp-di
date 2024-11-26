import ts, { CallExpression } from 'typescript';
import { BlueprintGetter } from '../../repositories/blueprints.js';
import { Value } from '../../repositories/values.js';
import { Blueprints, FunctionLikeNode, ModuleMember } from '../../types.js';

type HasMember<T> = T & {
  member: ModuleMember<FunctionLikeNode>;
};

export type FunctionFill = {
  values: Value[];
  target: ModuleMember<FunctionLikeNode>;
  /** Blueprints that the function return will satisfy. Extracted from target.expression.type */
  blueprints?: Blueprints;
};

/** Typed - function that returns a value fulfilling at least one Blueprint */
export type TypedFunctionFill = Required<FunctionFill>;

export type TypedFunctionFillMember = TypedFunctionFill & {
  member: ModuleMember<CallExpression>;
};
export type FunctionFillMember = FunctionFill & {
  member: ModuleMember<CallExpression>;
};

export type FillableParameter = { blueprints: Blueprints; isOptional: boolean };

export type Fillable = {
  /** Extracted blueprints for each item in exportedAs.expression.parameters */
  parameters: FillableParameter[];
  /** Blueprints matching exportedAs.expression.type */
  blueprints?: Blueprints;
};

/** Typed - function that will return a value fulfilling at least one Blueprint  */
export type TypedFillable = Required<Fillable>;

export type FillableMember = HasMember<Fillable>;
export type TypedFillableMember = HasMember<TypedFillable>;

export type EligibleFillParseContext = {
  typeChecker: ts.TypeChecker;
  getBlueprint: BlueprintGetter;
};

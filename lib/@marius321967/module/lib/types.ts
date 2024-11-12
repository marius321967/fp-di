import ts from 'typescript';
import { Blueprint } from './repositories/blueprints';

export type FunctionLikeNode = ts.Node &
  Pick<ts.ArrowFunction, 'parameters' | 'type' | 'getSourceFile'>;

export type TypedFunctionLikeNode = Omit<FunctionLikeNode, 'type'> & {
  type: ts.TypeReference;
};

export type ParameterContainer = Pick<FunctionLikeNode, 'parameters'>;

export type Blueprints = Blueprint[];

export type ExportAs =
  | { type: 'default' }
  | { type: 'named'; name: string; identifierNode: ts.Identifier };

export type ModuleMember<T> = {
  filePath: string;
  exportedAs: ExportAs;
  expression: T;
};

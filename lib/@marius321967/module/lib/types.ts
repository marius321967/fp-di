import ts from 'typescript';

export type FunctionLikeNode = {
  parameters: ts.NodeArray<ts.ParameterDeclaration>;
};

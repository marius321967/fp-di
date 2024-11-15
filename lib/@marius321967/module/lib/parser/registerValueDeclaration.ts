import ts, { TypeReferenceNode } from 'typescript';
import { ValueAdder } from '../repositories/values';
import { valueDeclarationRegistrator } from './valueDeclarationRegistrator';

export const registerValueDeclaration = (
  node: ts.VariableDeclaration & {
    type: TypeReferenceNode | ts.IntersectionTypeNode;
  },
  typeChecker: ts.TypeChecker,
  addValue: ValueAdder,
): void => valueDeclarationRegistrator(addValue, typeChecker)(node);

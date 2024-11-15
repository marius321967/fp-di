import ts from 'typescript';
import { canExtractOfferedTypes } from './toOfferedTypes';

/** @returns True if variable declaration is eligible for registration as Value */
export const isEligibleValue = (
  node: ts.VariableDeclaration,
): node is ts.VariableDeclaration & {
  type: ts.TypeReferenceNode | ts.IntersectionTypeNode;
} => node.type !== undefined && canExtractOfferedTypes(node.type);

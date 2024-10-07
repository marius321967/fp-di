import ts from 'typescript';

/**
 * Currently only direct type reference is supported
 * TODO: support UnionType
 * @returns True if variable declaration is eligible for registration as Value
 */
export const isEligibleValue = (
  node: ts.VariableDeclaration,
): node is ts.VariableDeclaration & { type: ts.TypeReferenceNode } =>
  node.type !== undefined && ts.isTypeReferenceNode(node.type);

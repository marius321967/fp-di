import ts from 'typescript';

/**
 * @returns Single element if node is TypeReference; all types if node is IntersectionType
 * @see canExtractAcceptedTypes
 */
export const toOfferedTypes = (
  typeNode: ts.TypeNode,
): ts.TypeReferenceNode[] => {
  if (ts.isTypeReferenceNode(typeNode)) {
    return [typeNode];
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    return typeNode.types.filter(ts.isTypeReferenceNode);
  }

  throw new Error(
    `Cannot extract accepted types from type node [${typeNode.getText()}]: unsupported type node. Only TypeReferenceNode and IntersectionType supported.`,
  );
};

export const canExtractOfferedTypes = (
  typeNode: ts.TypeNode,
): typeNode is ts.TypeReferenceNode | ts.IntersectionTypeNode =>
  ts.isTypeReferenceNode(typeNode) || ts.isIntersectionTypeNode(typeNode);

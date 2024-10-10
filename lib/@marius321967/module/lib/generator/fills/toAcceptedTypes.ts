import ts from 'typescript';

/** @returns Single element if node is TypeReference; all types if node is UnionType */
export const toAcceptedTypes = (
  typeNode: ts.TypeNode,
): ts.TypeReferenceNode[] => {
  if (ts.isTypeReferenceNode(typeNode)) {
    return [typeNode];
  }

  if (ts.isUnionTypeNode(typeNode)) {
    return typeNode.types.filter((type) =>
      ts.isTypeReferenceNode(type),
    ) as ts.TypeReferenceNode[];
  }

  throw new Error(
    `Cannot extract accepted types from type node [${typeNode.getText()}]: unsupported type node. Only TypeReferenceNode and UnionTypeNode supported.`,
  );
};

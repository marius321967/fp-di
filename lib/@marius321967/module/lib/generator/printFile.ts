import ts from 'typescript';

export const printFile = (nodes: ts.Node[]): string =>
  ts
    .createPrinter()
    .printList(
      ts.ListFormat.MultiLine,
      ts.factory.createNodeArray(nodes),
      ts.createSourceFile('', '', ts.ScriptTarget.Latest),
    );

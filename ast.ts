import ts, { factory } from 'typescript';

const filePath = './index.ts';
const program = ts.createProgram([filePath, 'foo.ts'], {});
const checker = program.getTypeChecker();

const source = program.getSourceFile(filePath);

if (!source) {
  process.exit();
}

const printer = ts.createPrinter();

const kind = (node: ts.Node) => {
  return ts.SyntaxKind[node.kind];
};

const doSomething = (node: any) => {
  if (ts.isCallExpression(node)) {
    console.log(node.expression);
  }
};

// algo:
// 1. find registerBuilder type
// 2. find all calls to registerBuilder()
// 3. store registrations in a map
// 

ts.forEachChild(source, (node) => {
  doSomething(node);
  node.forEachChild(doSomething);

  // console.log(kind(node));
  // if (ts.isVariableStatement(node)) {
  //   node.declarationList.forEachChild((node) => {
  //     // console.log(kind(declaration))
  //     if (
  //       ts.isVariableDeclaration(node) &&
  //       ts.isArrowFunction(node.initializer)
  //     ) {
  //       const fn = node.initializer;
  //       const signature = checker.getSignatureFromDeclaration(fn);
  //       if (ts.isTypeReferenceNode(fn.type)) {
  //         fn.type.forEachChild((tChild) => {
  //           if (ts.isIdentifier(tChild)) {
  //             const symbol = checker.getSymbolAtLocation(tChild);
  //             console.log(symbol);
  //           }
  //           console.log(tChild.getText());
  //         });
  //       }
  //       const symbol = checker.getSymbolAtLocation(fn.type);
  //       const type = checker.getTypeAtLocation(fn);
  //       // console.log(symbol);
  //       // checker.
  //       // fn.forEachChild((fnChild) => {
  //       //   if (ts.isTypeReferenceNode(fnChild)) {
  //       //     console.log(checker.getSymbolAtLocation(fnChild));
  //       //   }
  //       // });
  //     }
  //   });
  // }
});

// console.log(printer.printFile(outSource));

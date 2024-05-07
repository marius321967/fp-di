import ts from 'typescript';
import { addIdentifier, getIdentifier } from './symbol-map.js';

const filePath = './index2.ts';
const program = ts.createProgram([filePath], {});
const checker = program.getTypeChecker();

const source = program.getSourceFile(filePath);

if (!source) {
  process.exit();
}

const printer = ts.createPrinter();


const registerTypeDeclaration = (node: ts.TypeAliasDeclaration): void => {
  const symbol = checker.getSymbolAtLocation(node.name);

  if (!symbol) {
    throw new Error('not found symbol');
  }

  addIdentifier(symbol, node.name);
};

const registerValueDeclarations = (node: ts.VariableStatement): void => {
  node.declarationList.declarations.forEach(registerValueDeclaration);
};

const registerValueDeclaration = (node: ts.VariableDeclaration): void => {
  if (node.type === undefined) return;

  const variableBroadType = node.type;

  // FUTURE: handle union types as well
  if (!ts.isTypeReferenceNode(variableBroadType)) return;

  const localIdentifier = variableBroadType.typeName;
  const symbol = checker.getSymbolAtLocation(localIdentifier);

  if (!symbol) throw new Error('symbol not found');

  const identifier = getIdentifier(symbol);

  if (!identifier) return;

  console.log(
    `found value declaration [${identifier.getText()}]: ${node.getText()}`,
  );
};

ts.forEachChild(source, (node) => {
  const nodeKind = kind(node);

  if (isExportedTypeDeclaration(node)) {
    registerTypeDeclaration(node);
  }

  if (isExportedVariableDeclaration(node)) {
    registerValueDeclarations(node);
  }

  if (ts.isExportAssignment)

  // findIdentifiers(node);

  // if (ts.isVariableStatement(node)) {
  //   node.declarationList.forEachChild((node) => {
  //     if (
  //       ts.isVariableDeclaration(node) &&
  //       node.initializer &&
  //       ts.isArrowFunction(node.initializer!)
  //     ) {
  //       const fn = node.initializer;
  //       if (!fn.type) return;

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

  //       fn.forEachChild((fnChild) => {
  //         if (ts.isTypeReferenceNode(fnChild)) {
  //           console.log(checker.getSymbolAtLocation(fnChild));
  //         }
  //       });
  //     }
  //   });
  // }
});

import ts from 'typescript';
import { addIdentifier, getIdentifier } from './symbol-map';

let checker;

export const setChecker = (newChecker: ts.TypeChecker): void => {
  checker = newChecker;
};

export const registerTypeDeclaration = (
  node: ts.TypeAliasDeclaration,
): void => {
  const symbol = checker.getSymbolAtLocation(node.name);

  if (!symbol) {
    throw new Error('not found symbol');
  }

  addIdentifier(symbol, node.name);
};

export const registerValueDeclarations = (node: ts.VariableStatement): void => {
  node.declarationList.declarations.forEach(registerValueDeclaration);
};

export const registerValueDeclaration = (
  node: ts.VariableDeclaration,
): void => {
  if (node.type === undefined) return;

  const variableBroadType = node.type;

  // FUTURE: handle union types as well
  if (!ts.isTypeReferenceNode(variableBroadType)) return;

  const localIdentifier = variableBroadType.typeName;
  const symbol = checker.getSymbolAtLocation(localIdentifier);

  if (!symbol) throw new Error('symbol not found');

  const identifier = getIdentifier(symbol);

  if (!identifier) return;

  // console.log(
  //   `found value declaration [${identifier.getText()}]: ${node.getText()}`,
  // );
};

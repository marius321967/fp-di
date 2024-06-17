import ts from 'typescript';
import { SymbolAdder } from './symbol-map';
import { ValueAdder } from './value-map';

export const getParsedConfig = (
  basePath: string,
  configFilename: string,
): ts.ParsedCommandLine =>
  ts.parseJsonSourceFileConfigFileContent(
    ts.readJsonConfigFile(configFilename, ts.sys.readFile),
    ts.sys,
    basePath,
  );

export const registerTypeDeclaration = (
  node: ts.TypeAliasDeclaration,
  typeChecker: ts.TypeChecker,
  addSymbol: SymbolAdder,
): void => {
  const symbol = typeChecker.getSymbolAtLocation(node.name);

  if (!symbol) {
    throw new Error('symbol not found');
  }

  addSymbol(symbol, node.name);
};

export const registerValueDeclarations = (
  node: ts.VariableStatement,
  typeChecker: ts.TypeChecker,
  addValue: ValueAdder,
): void => {
  node.declarationList.declarations.forEach(
    registerValueDeclaration(addValue, typeChecker),
  );
};

export const registerValueDeclaration =
  (addValue: ValueAdder, typeChecker: ts.TypeChecker) =>
  (node: ts.VariableDeclaration): void => {
    if (node.type === undefined) return;

    const variableBroadType = node.type;

    // FUTURE: handle union types as well
    if (!ts.isTypeReferenceNode(variableBroadType)) return;

    const localIdentifier = variableBroadType.typeName;
    const symbol = typeChecker.getSymbolAtLocation(localIdentifier);

    if (!symbol) throw new Error('symbol not found');

    addValue(symbol, node);

    // console.log(
    //   `found value declaration [${identifier.getText()}]: ${node.getText()}`,
    // );
  };

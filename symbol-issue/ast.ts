import ts, { SymbolFlags } from 'typescript';

const programFiles = [__dirname + '/prog2.ts', __dirname + '/prog1.ts'];

const program = ts.createProgram(programFiles, {});

const typeChecker = program.getTypeChecker();

const programSources = programFiles.map(
  (file) => program.getSourceFile(file) as ts.SourceFile,
);

const symbols: ts.Symbol[] = [];

programSources.forEach((sourceFile) => {
  sourceFile.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      const symbol = typeChecker.getSymbolAtLocation(node.name);

      if (!symbol) {
        throw new Error(
          `Type declaration not found for symbol [${node.name.getText()}]`,
        );
      }

      symbols.push(symbol);
    }

    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((declaration) => {
        const declarationType = declaration.type;

        if (!declarationType) {
          throw new Error(`Var has no type [${declaration.name.getText()}]`);
        }

        const typeIdentifier = declarationType.getChildAt(0);

        if (!ts.isIdentifier(typeIdentifier)) {
          throw new Error(
            `Type declaration is not an identifier [${declaration.name.getText()}]`,
          );
        }

        const localSymbol = typeChecker.getSymbolAtLocation(typeIdentifier);

        if (!localSymbol) {
          throw new Error(
            `Type declaration not found for symbol [${declaration.name.getText()}]`,
          );
        }

        // Solution here:
        const originalSymbol =
          (localSymbol.flags & SymbolFlags.Alias) !== 0
            ? typeChecker.getAliasedSymbol(localSymbol)
            : localSymbol;

        symbols.push(originalSymbol);
      });
    }
  });
});

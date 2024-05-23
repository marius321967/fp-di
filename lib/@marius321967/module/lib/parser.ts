import ts from 'typescript';
import {
  isEntrypointDeclaration,
  isExportedTypeDeclaration,
  isExportedVariableDeclaration,
} from './helpers';
import { IdentifierMap, getIdentifiers } from './symbol-map';
import {
  registerTypeDeclaration,
  registerValueDeclarations,
  setChecker,
} from './tools';
import { ValueMap, getValues } from './value-map';

export type ParseResult = {
  entrypoint: ts.ExportAssignment;
  identifiers: IdentifierMap;
  values: ValueMap;
};

export const parse = (
  program: ts.Program,
  entrypointFile: string,
): ParseResult => {
  const checker = program.getTypeChecker();
  setChecker(checker);

  const source = program.getSourceFile(entrypointFile);

  if (!source) {
    throw new Error('No source');
  }

  let entrypointDeclaration: ts.ExportAssignment | null = null;

  source.forEachChild((node) => {
    if (isExportedTypeDeclaration(node)) {
      registerTypeDeclaration(node);
    }

    if (isExportedVariableDeclaration(node)) {
      registerValueDeclarations(node);
    }

    if (isEntrypointDeclaration(node)) {
      entrypointDeclaration = node;
    }

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

  if (!entrypointDeclaration) {
    throw new Error(
      'No entrypoint found. Must be arrow function exported as default.',
    );
  }

  return {
    entrypoint: entrypointDeclaration,
    identifiers: getIdentifiers(),
    values: getValues(),
  };
};

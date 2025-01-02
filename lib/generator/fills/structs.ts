import ts from 'typescript';
import {
  TypedFillableMember,
  TypedFunctionFillMember,
} from '../../parser/fills/structs.js';

export type FillFileSyntax = {
  fillExportNodes: ts.VariableStatement[];
  importNodes: ts.ImportDeclaration[];
};

export type FillsPassResult = {
  /** Fillables that could not be fulfilled in this pass */
  unfilledFillables: TypedFillableMember[];
  /** Successful function fills from this pass */
  newFills: TypedFunctionFillMember[];
};

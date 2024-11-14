import ts from 'typescript';
import {
  TypedEligibleFillableMember,
  TypedFunctionFillMember,
} from '../../parser/fills/structs';

export type FillFileSyntax = {
  fillExportNodes: ts.VariableStatement[];
  importNodes: ts.ImportDeclaration[];
};

export type FillsPassResult = {
  /** Fillables that could not be fulfilled in this pass */
  unfilledEligibleFillables: TypedEligibleFillableMember[];
  /** Successful function fills from this pass */
  newFills: TypedFunctionFillMember[];
};

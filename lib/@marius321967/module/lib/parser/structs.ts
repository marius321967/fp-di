import ts from 'typescript';
import { BlueprintRepository } from '../repositories/blueprints';
import { ValueRepository } from '../repositories/values';

export type ParserSet = {
  blueprints: BlueprintRepository;
  values: ValueRepository;
};

export type ParseResult = ParserSet & {
  entrypointExport: ProgramEntrypointExport;
};

export type ProgramEntrypointExport = ts.ExportAssignment & {
  expression: ts.ArrowFunction;
};

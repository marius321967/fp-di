import ts from 'typescript';
import { BlueprintRepository } from '../repositories/blueprints';
import { ValueRepository } from '../repositories/values';

export type DependencyContext = {
  blueprints: BlueprintRepository;
  values: ValueRepository;
};

export type ParseResult = DependencyContext & {
  entrypointExport: ProgramEntrypointExport;
};

export type ProgramEntrypointExport = ts.ExportAssignment & {
  expression: ts.ArrowFunction;
};

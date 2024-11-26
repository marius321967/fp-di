import ts from 'typescript';
import { BlueprintRepository } from '../repositories/blueprints.js';
import { ValueRepository } from '../repositories/values.js';
import { FillableMember } from './fills/structs.js';

export type DependencyContext = {
  blueprints: BlueprintRepository;
  values: ValueRepository;
};

export type ParseResult = DependencyContext & {
  entrypoint: FillableMember;
};

export type ProgramEntrypointExport = Omit<
  ts.ExportAssignment,
  'expression'
> & {
  expression: ts.ArrowFunction;
};

import ts from 'typescript';
import { BlueprintRepository } from '../repositories/blueprints';
import { ValueRepository } from '../repositories/values';
import { FunctionLikeNode } from '../types';
import { ModuleMember } from './fills/structs';

export type DependencyContext = {
  blueprints: BlueprintRepository;
  values: ValueRepository;
};

export type ParseResult = DependencyContext & {
  entrypoint: ModuleMember<FunctionLikeNode>;
};

export type ProgramEntrypointExport = Omit<
  ts.ExportAssignment,
  'expression'
> & {
  expression: ts.ArrowFunction;
};

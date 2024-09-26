import ts from 'typescript';
import { BlueprintRepository } from '../blueprint-map';
import { ValueRepository } from '../value-map';

export type ParserSet = {
  blueprints: BlueprintRepository;
  values: ValueRepository;
};

export type ParseResult = ParserSet & {
  entrypoint: ts.ExportAssignment;
};

import { Blueprint } from '../repositories/blueprints';
import { ValueGetter, ValueMapEntry } from '../repositories/values';
import { resolveValueFromCandidateSymbols } from './resolveValueFromCandidateSymbols';

export const resolveValueFromCandidateBlueprints = (
  blueprints: Blueprint[],
  getValue: ValueGetter,
): ValueMapEntry | null =>
  resolveValueFromCandidateSymbols(
    blueprints.map(({ originalSymbol }) => originalSymbol),
    getValue,
  );

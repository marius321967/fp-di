import { Blueprint } from '../repositories/blueprints';
import { Value, ValueGetter } from '../repositories/values';
import { resolveValueFromCandidateSymbols } from './resolveValueFromCandidateSymbols';

export const resolveValueFromCandidateBlueprints = (
  blueprints: Blueprint[],
  getValue: ValueGetter,
): Value | null =>
  resolveValueFromCandidateSymbols(
    blueprints.map(({ originalSymbol }) => originalSymbol),
    getValue,
  );

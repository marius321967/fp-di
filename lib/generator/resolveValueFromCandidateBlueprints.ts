import { Blueprint } from '../repositories/blueprints.js';
import { Value, ValueGetter } from '../repositories/values.js';
import { resolveValueFromCandidateSymbols } from './resolveValueFromCandidateSymbols.js';

export const resolveValueFromCandidateBlueprints = (
  blueprints: Blueprint[],
  getValue: ValueGetter,
): Value | null =>
  resolveValueFromCandidateSymbols(
    blueprints.map(({ originalSymbol }) => originalSymbol),
    getValue,
  );

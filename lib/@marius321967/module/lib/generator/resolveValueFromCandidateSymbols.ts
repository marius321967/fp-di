import ts from 'typescript';
import { Value, ValueGetter } from '../repositories/values';

export const resolveValueFromCandidateSymbols = (
  symbols: ts.Symbol[],
  getValue: ValueGetter,
): Value | null => {
  for (const symbol of symbols) {
    const value = getValue(symbol);

    if (value) {
      return value;
    }
  }

  return null;
};

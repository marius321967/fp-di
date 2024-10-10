import ts from 'typescript';
import { ValueGetter, ValueMapEntry } from '../repositories/values';

export const resolveValueFromCandidateSymbols = (
  symbols: ts.Symbol[],
  getValue: ValueGetter,
): ValueMapEntry | null => {
  for (const symbol of symbols) {
    const value = getValue(symbol);

    if (value) {
      return value;
    }
  }

  return null;
};

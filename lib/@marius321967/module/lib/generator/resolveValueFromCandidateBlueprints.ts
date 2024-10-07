import { Blueprint } from '../repositories/blueprints';
import { ValueGetter, ValueMapEntry } from '../repositories/values';

export const resolveValueFromCandidateBlueprints = (
  blueprints: Blueprint[],
  getValue: ValueGetter,
): ValueMapEntry | null => {
  for (const blueprint of blueprints) {
    const value = getValue(blueprint.originalSymbol);

    if (value) {
      return value;
    }
  }

  return null;
};

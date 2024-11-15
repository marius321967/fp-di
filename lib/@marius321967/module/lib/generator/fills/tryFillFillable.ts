import { FillableMember, FunctionFill } from '../../parser/fills/structs';
import { Value, ValueGetter } from '../../repositories/values';
import { resolveValueFromCandidateBlueprints } from '../resolveValueFromCandidateBlueprints';

export const tryFillFillable = (
  fillable: FillableMember,
  getValue: ValueGetter,
): FunctionFill | null => {
  const values = fillable.parameterBlueprints.map((blueprints) => {
    return resolveValueFromCandidateBlueprints(blueprints, getValue);
  });

  if (values.some((el) => el === null)) {
    return null;
  }

  return {
    target: fillable.exportedAs,
    values: values as Value[],
  };
};

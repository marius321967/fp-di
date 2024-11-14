import {
  EligibleFillableMember,
  FunctionFill,
} from '../../parser/fills/structs';
import { Value, ValueGetter } from '../../repositories/values';
import { resolveValueFromCandidateBlueprints } from '../resolveValueFromCandidateBlueprints';

export const tryFillEligibleFillable = (
  eligibleFillable: EligibleFillableMember,
  getValue: ValueGetter,
): FunctionFill | null => {
  const values = eligibleFillable.parameterBlueprints.map((blueprints) => {
    return resolveValueFromCandidateBlueprints(blueprints, getValue);
  });

  if (values.some((el) => el === null)) {
    return null;
  }

  return {
    target: eligibleFillable.exportedAs,
    values: values as Value[],
  };
};

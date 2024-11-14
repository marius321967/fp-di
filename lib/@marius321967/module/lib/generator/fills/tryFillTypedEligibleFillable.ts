import {
  TypedEligibleFillableMember,
  TypedFunctionFill,
} from '../../parser/fills/structs';
import { ValueGetter } from '../../repositories/values';
import { tryFillEligibleFillable } from './tryFillEligibleFillable';

export const tryFillTypedEligibleFillable = (
  eligibleFillable: TypedEligibleFillableMember,
  getValue: ValueGetter,
): TypedFunctionFill | null => {
  const fill = tryFillEligibleFillable(eligibleFillable, getValue);

  return fill ? { ...fill, blueprints: eligibleFillable.blueprints } : null;
};

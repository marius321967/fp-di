import {
  TypedFillableMember,
  TypedFunctionFill,
} from '../../parser/fills/structs';
import { ValueGetter } from '../../repositories/values';
import { tryFillFillable } from './tryFillFillable';

export const tryFillTypedFillable = (
  fillable: TypedFillableMember,
  getValue: ValueGetter,
): TypedFunctionFill | null => {
  const fill = tryFillFillable(fillable, getValue);

  return fill ? { ...fill, blueprints: fillable.blueprints } : null;
};

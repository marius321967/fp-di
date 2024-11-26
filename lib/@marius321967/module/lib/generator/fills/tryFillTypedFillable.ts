import {
  TypedFillableMember,
  TypedFunctionFill,
} from '../../parser/fills/structs.js';
import { ValueGetter } from '../../repositories/values.js';
import { tryFillFillable } from './tryFillFillable.js';

export const tryFillTypedFillable = (
  fillable: TypedFillableMember,
  getValue: ValueGetter,
): TypedFunctionFill | null => {
  const fill = tryFillFillable(fillable, getValue);

  return fill ? { ...fill, blueprints: fillable.blueprints } : null;
};

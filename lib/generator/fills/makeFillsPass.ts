import { TypedFillableMember } from '../../parser/fills/structs.js';
import { DependencyContext } from '../../parser/structs.js';
import { introduceFunctionFill } from './introduceFunctionFill.js';
import { FillsPassResult } from './structs.js';
import { tryFillTypedFillable } from './tryFillTypedFillable.js';

/**
 * @param context Used to access existing metadata for filling functions.
 */
export const makeFillsPass = (
  fillables: TypedFillableMember[],
  context: DependencyContext,
): FillsPassResult =>
  fillables.reduce<FillsPassResult>(fillsPassReducer(context), {
    unfilledFillables: [],
    newFills: [],
  });

const fillsPassReducer =
  (context: DependencyContext) =>
  (acc: FillsPassResult, fillable: TypedFillableMember): FillsPassResult => {
    const fill = tryFillTypedFillable(fillable, context.values.getValue);

    return fill
      ? {
          unfilledFillables: acc.unfilledFillables,
          newFills: [...acc.newFills, introduceFunctionFill(fill)],
        }
      : {
          unfilledFillables: [...acc.unfilledFillables, fillable],
          newFills: acc.newFills,
        };
  };

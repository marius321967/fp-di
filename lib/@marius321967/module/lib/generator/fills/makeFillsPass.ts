import { TypedEligibleFillableMember } from '../../parser/fills/structs';
import { DependencyContext } from '../../parser/structs';
import { introduceFunctionFill } from './introduceFunctionFill';
import { FillsPassResult } from './structs';
import { tryFillTypedEligibleFillable } from './tryFillTypedEligibleFillable';

/**
 * @param context Used to access existing metadata for filling functions.
 */
export const makeFillsPass = (
  eligibleFillables: TypedEligibleFillableMember[],
  context: DependencyContext,
): FillsPassResult =>
  eligibleFillables.reduce<FillsPassResult>(fillsPassReducer(context), {
    unfilledEligibleFillables: [],
    newFills: [],
  });

const fillsPassReducer =
  (context: DependencyContext) =>
  (
    acc: FillsPassResult,
    eligibleFillable: TypedEligibleFillableMember,
  ): FillsPassResult => {
    const fill = tryFillTypedEligibleFillable(
      eligibleFillable,
      context.values.getValue,
    );

    return fill
      ? {
          unfilledEligibleFillables: acc.unfilledEligibleFillables,
          newFills: [...acc.newFills, introduceFunctionFill(fill)],
        }
      : {
          unfilledEligibleFillables: [
            ...acc.unfilledEligibleFillables,
            eligibleFillable,
          ],
          newFills: acc.newFills,
        };
  };

import { tryFillTypedEligibleFillable } from '../../generator/fills/tryFillTypedEligibleFillable';
import { DependencyContext } from '../structs';
import { introduceFunctionFill } from './introduceFunctionFill';
import {
  TypedEligibleFillableMember,
  TypedFunctionFillMember,
} from './structs';

type FillsPassResult = {
  /** Fillables that could not be fulfilled in this pass */
  unfilledEligibleFillables: TypedEligibleFillableMember[];
  /** Successful function fills from this pass */
  newFills: TypedFunctionFillMember[];
};

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

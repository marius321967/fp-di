import { TypedFunctionFillMember } from '../../parser/fills/structs.js';
import { ValueAdder } from '../../repositories/values.js';

export const addFillsToValues = (
  fills: TypedFunctionFillMember[],
  addValue: ValueAdder,
): void => {
  fills.forEach((fill) => {
    const originalSymbols = fill.blueprints.map(
      ({ originalSymbol }) => originalSymbol,
    );

    addValue(originalSymbols, fill.member);
  });
};

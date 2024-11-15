import { TypedFunctionFillMember } from '../../parser/fills/structs';
import { ValueAdder } from '../../repositories/values';

export const addFillsToValues = (
  fills: TypedFunctionFillMember[],
  addValue: ValueAdder,
): void => {
  fills.forEach((fill) => {
    const originalSymbols = fill.blueprints.map(
      ({ originalSymbol }) => originalSymbol,
    );

    addValue(originalSymbols, fill.exportedAs);
  });
};

import { parseEligibleFillables } from '../parser/fills/parseEligibleFillables';
import { FunctionFill, TypedFunctionFillMember } from '../parser/fills/structs';
import { ParseResult } from '../parser/structs';
import { getStartPath } from '../tools';
import { PreparedProgram } from '../types';
import { compileStart } from './compileStart';
import { addFillsToValues, compileFills } from './fills';
import { makeFillsPass } from './fills/makeFillsPass';
import { tryFillEligibleFillable } from './fills/tryFillEligibleFillable';

export const generateAssets = (
  parseResult: ParseResult,
  { programFiles, program, programEntrypointPath }: PreparedProgram,
): void => {
  let remainingFillables = parseEligibleFillables(
    programFiles,
    program,
    parseResult.blueprints.getBlueprint,
  );
  let fills: TypedFunctionFillMember[] = [];
  let filledEntrypoint: FunctionFill | null = null;

  while (!filledEntrypoint) {
    const passResult = makeFillsPass(remainingFillables, parseResult);

    if (passResult.newFills.length === 0) {
      throw new Error('Entrypoint function could not be filled');
    }

    remainingFillables = passResult.unfilledEligibleFillables;
    fills = [...fills, ...passResult.newFills];

    addFillsToValues(passResult.newFills, parseResult.values.addValue);

    filledEntrypoint = tryFillEligibleFillable(
      parseResult.entrypoint,
      parseResult.values.getValue,
    );
  }

  compileFills(fills);
  compileStart(filledEntrypoint, getStartPath(programEntrypointPath));
};

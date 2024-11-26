import { parseFillables } from '../parser/fills/parseFillables.js';
import { TypedFunctionFillMember } from '../parser/fills/structs.js';
import { ParseResult } from '../parser/structs.js';
import { getStartPath } from '../tools.js';
import { PreparedProgram } from '../types.js';
import { compileStart } from './compileStart.js';
import { addFillsToValues } from './fills/addFillstoValues.js';
import { compileFills } from './fills/index.js';
import { makeFillsPass } from './fills/makeFillsPass.js';
import { tryFillFillable } from './fills/tryFillFillable.js';

export const generateAssets = (
  parseResult: ParseResult,
  { programFiles, program, programEntrypointPath }: PreparedProgram,
): void => {
  let remainingFillables = parseFillables(
    programFiles,
    program,
    parseResult.blueprints.getBlueprint,
  );

  let fills: TypedFunctionFillMember[] = [];

  let filledEntrypoint = tryFillFillable(
    parseResult.entrypoint,
    parseResult.values.getValue,
  );

  while (!filledEntrypoint) {
    const passResult = makeFillsPass(remainingFillables, parseResult);

    if (passResult.newFills.length === 0) {
      throw new Error('Entrypoint function could not be filled');
    }

    remainingFillables = passResult.unfilledFillables;
    fills = [...fills, ...passResult.newFills];

    addFillsToValues(passResult.newFills, parseResult.values.addValue);

    filledEntrypoint = tryFillFillable(
      parseResult.entrypoint,
      parseResult.values.getValue,
    );
  }

  compileFills(fills);
  compileStart(filledEntrypoint, getStartPath(programEntrypointPath));
};

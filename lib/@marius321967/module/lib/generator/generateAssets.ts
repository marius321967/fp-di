import { parseFillables } from '../parser/fills/parseFillables';
import { TypedFunctionFillMember } from '../parser/fills/structs';
import { ParseResult } from '../parser/structs';
import { getStartPath } from '../tools';
import { PreparedProgram } from '../types';
import { compileStart } from './compileStart';
import { compileFills } from './fills';
import { addFillsToValues } from './fills/addFillstoValues';
import { makeFillsPass } from './fills/makeFillsPass';
import { tryFillFillable } from './fills/tryFillFillable';

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

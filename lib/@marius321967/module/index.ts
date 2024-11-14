import { compileFills } from './lib/generator/fills';
import { makeFillsPass } from './lib/generator/fills/makeFillsPass';
import { tryFillEligibleFillable } from './lib/generator/fills/tryFillEligibleFillable';
import { generateStart } from './lib/generator/generateStart';
import { assertIsPresent } from './lib/helpers/assert';
import { parseProgram } from './lib/parser';
import { parseEligibleFillables } from './lib/parser/fills/parseEligibleFillables';
import {
  EligibleFillableMember,
  FunctionFill,
  TypedFunctionFillMember,
} from './lib/parser/fills/structs';
import { probeEligibleFillable } from './lib/parser/fills/tryExtractEligibleFillable';
import { ValueAdder } from './lib/repositories/values';
import { getStartPath, prepareProgram } from './lib/tools';

export const transform = (programDir: string): void => {
  const { program, programFiles, programEntrypointPath } =
    prepareProgram(programDir);

  const parseResult = parseProgram(
    programFiles,
    programEntrypointPath,
    program,
  );

  const entrypointFillable = probeEligibleFillable(
    parseResult.entrypoint.expression,
    program.getTypeChecker(),
    parseResult.blueprints.getBlueprint,
  );

  assertIsPresent(
    entrypointFillable,
    'Entrypoint function cannot be injected with Values',
  );

  const entrypointFillableMember: EligibleFillableMember = {
    ...entrypointFillable,
    exportedAs: parseResult.entrypoint,
  };

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
      entrypointFillableMember,
      parseResult.values.getValue,
    );
  }

  compileFills(fills);
  generateStart(filledEntrypoint, getStartPath(programEntrypointPath));
};

const addFillsToValues = (
  fills: TypedFunctionFillMember[],
  addValue: ValueAdder,
): void => {
  fills.forEach((fill) => {
    fill.blueprints.forEach((blueprint) => {
      addValue(blueprint.originalSymbol, fill.exportedAs);
    });
  });
};

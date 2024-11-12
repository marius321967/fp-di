import path from 'path';
import { compileFills } from './lib/generator/fills';
import { generateStart } from './lib/generator/generateStart';
import { assertIsPresent } from './lib/helpers/assert';
import { parseProgram } from './lib/parser';
import { makeFillsPass, tryFillEligibleFillable } from './lib/parser/fills';
import {
  EligibleFillableMember,
  TypedFunctionFillMember,
} from './lib/parser/fills/structs';
import { probeEligibleFillable } from './lib/parser/fills/tryExtractEligibleFillable';
import { prepareProgram } from './lib/tools';

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

  let fills: TypedFunctionFillMember[] = [];

  while (true) {
    const newFills = makeFillsPass(programFiles, program, parseResult);

    if (newFills.length === 0) {
      throw new Error('Entrypoint function could not be filled');
    }

    fills = [...fills, ...newFills];

    const filledEntrypoint = tryFillEligibleFillable(
      entrypointFillableMember,
      parseResult.values.getValue,
    );

    if (!!filledEntrypoint) {
      generateStart(filledEntrypoint, getStartPath(programEntrypointPath));
      compileFills(fills);

      break;
    }
  }
};

const getStartPath = (entrypointPath: string): string => {
  const programDir = path.dirname(entrypointPath);

  return path.join(programDir, 'start.ts');
};

import path from 'path';
import { compileFills } from './lib/generator/fills';
import { generateStart } from './lib/generator/generateStart';
import { assertIsPresent } from './lib/helpers/assert';
import { parseProgram } from './lib/parser';
import { makeFillsPass, tryFillEligibleFillable } from './lib/parser/fills';
import {
  EligibleFillableMember,
  FunctionFillMember,
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

    fills = temporary_addNewFills(fills, newFills);

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

const temporary_fillsMatch = (
  f1: FunctionFillMember,
  f2: FunctionFillMember,
): boolean => {
  if (
    f1.exportedAs.filePath !== f2.exportedAs.filePath ||
    f1.exportedAs.exportedAs.type !== f2.exportedAs.exportedAs.type
  )
    return false;

  return f1.exportedAs.exportedAs.type === 'named' &&
    f2.exportedAs.exportedAs.type === 'named'
    ? f1.exportedAs.exportedAs.name === f2.exportedAs.exportedAs.name
    : true;
};

const temporary_addNewFills = (
  fills: TypedFunctionFillMember[],
  newFills: TypedFunctionFillMember[],
): TypedFunctionFillMember[] => {
  const newFillsFiltered = newFills.filter(
    (fill) => !fills.some((oldFill) => temporary_fillsMatch(oldFill, fill)),
  );

  return [...fills, ...newFillsFiltered];
};

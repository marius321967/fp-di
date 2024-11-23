import { excludeNull } from '../../helpers/structs';
import { FillableMember, FunctionFill } from '../../parser/fills/structs';
import { Value, ValueGetter } from '../../repositories/values';
import { resolveValueFromCandidateBlueprints } from '../resolveValueFromCandidateBlueprints';

type FilledParameter = { value: Value | null; isOptional: boolean };

export const tryFillFillable = (
  fillable: FillableMember,
  getValue: ValueGetter,
): FunctionFill | null => {
  const filledParameters = fillable.parameters.map<FilledParameter>(
    (parameter) => ({
      value: resolveValueFromCandidateBlueprints(
        parameter.blueprints,
        getValue,
      ),
      isOptional: parameter.isOptional,
    }),
  );

  if (filledParameters.some((el) => el.value === null && !el.isOptional)) {
    return null;
  }

  return {
    target: fillable.member,
    values: filledParameters.map(({ value }) => value).filter(excludeNull),
  };
};

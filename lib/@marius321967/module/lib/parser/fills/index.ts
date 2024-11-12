import ts from 'typescript';
import {
  generateFillModulePath,
  generateFillName,
} from '../../generator/fills/fill-naming';
import { createFillInitializer } from '../../generator/fills/generateFillSyntax';
import { resolveValueFromCandidateBlueprints } from '../../generator/resolveValueFromCandidateBlueprints';
import { assertIsPresent } from '../../helpers/assert';
import {
  isDefaultExportDeclaration,
  isExportedVariableDeclaration,
  isFunctionLikeNode,
} from '../../node.type-guards';
import { Value, ValueGetter } from '../../repositories/values';
import { FunctionLikeNode, ModuleMember } from '../../types';
import { DependencyContext } from '../structs';
import {
  EligibleFillableMember,
  FunctionFill,
  TypedEligibleFillable,
  TypedEligibleFillableMember,
  TypedFunctionFill,
  TypedFunctionFillMember,
} from './structs';
import {
  exportAssignmentToExportAs,
  probeDefaultExportForEligibleFillable,
  probeNamedExportsForEligibleFillable,
} from './tryExtractEligibleFillable';

const fileEligibleFillableReducer =
  (program: ts.Program, context: DependencyContext) =>
  (acc: TypedEligibleFillableMember[], node: ts.Node) => {
    // export const x = ...;
    if (isExportedVariableDeclaration(node)) {
      const eligibleFillableMembers = probeNamedExportsForEligibleFillable(
        node,
        program.getTypeChecker(),
        context.blueprints.getBlueprint,
      ).filter(
        (eligibleFillable): eligibleFillable is TypedEligibleFillableMember =>
          !!eligibleFillable.blueprints,
      );

      return [...acc, ...eligibleFillableMembers];
    }

    // export default ...;
    if (isDefaultExportDeclaration(node)) {
      const eligibleFillable = probeDefaultExportForEligibleFillable(
        node,
        program.getTypeChecker(),
        context.blueprints.getBlueprint,
      );

      return eligibleFillable &&
        eligibleFillable.blueprints &&
        isFunctionLikeNode(node.expression)
        ? [
            ...acc,
            {
              ...(eligibleFillable as TypedEligibleFillable),
              exportedAs: {
                expression: node.expression as FunctionLikeNode,
                exportedAs: exportAssignmentToExportAs(),
                filePath: node.getSourceFile().fileName,
              },
            },
          ]
        : acc;
    }

    return acc;
  };

export const parseFile = (
  modulePath: string,
  program: ts.Program,
  context: DependencyContext,
): TypedFunctionFill[] => {
  const source = program.getSourceFile(modulePath);
  assertIsPresent(source, `File [${modulePath}] not found in program`);

  return source
    .getChildren()
    .map((node) => node.getChildren())
    .reduce((acc, children) => [...acc, ...children], [])
    .reduce(fileEligibleFillableReducer(program, context), [])
    .reduce<TypedFunctionFill[]>((acc, eligibleFillable) => {
      const fill = tryFillTypedEligibleFillable(
        eligibleFillable,
        context.values.getValue,
      );

      return fill ? [...acc, fill] : acc;
    }, []);
};

/**
 * @param context Used to access existing metadata for filling functions.
 * Context Values will be updated with the new fills.
 * @returns Metadata for processed function fills
 */
export const makeFillsPass = (
  programFiles: string[],
  program: ts.Program,
  context: DependencyContext,
): TypedFunctionFillMember[] => {
  const fills = programFiles.reduce<TypedFunctionFill[]>(
    (acc, path) => [...acc, ...parseFile(path, program, context)],
    [],
  );

  const memberFills: TypedFunctionFillMember[] = introduceFunctionFills(fills);

  memberFills.forEach((fill) => {
    fill.blueprints.forEach((blueprint) => {
      context.values.addValue(blueprint.originalSymbol, fill.exportedAs);
    });
  });

  return memberFills;
};

const introduceFunctionFills = (
  fills: TypedFunctionFill[],
): TypedFunctionFillMember[] => {
  return fills.map(introduceFunctionFill);
};

const introduceFunctionFill = (
  fill: TypedFunctionFill,
): TypedFunctionFillMember => {
  return {
    ...fill,
    exportedAs: makeMemberForFill(fill),
  };
};

const makeMemberForFill = (
  fill: TypedFunctionFill,
): ModuleMember<ts.CallExpression> => {
  return {
    expression: createFillInitializer(fill),
    exportedAs: {
      type: 'named',
      name: generateFillName(fill.target.exportedAs),
    },
    filePath: generateFillModulePath(fill.target.filePath),
  };
};

export const tryFillEligibleFillable = (
  eligibleFillable: EligibleFillableMember,
  getValue: ValueGetter,
): FunctionFill | null => {
  const values = eligibleFillable.parameterBlueprints.map((blueprints) => {
    return resolveValueFromCandidateBlueprints(blueprints, getValue);
  });

  if (values.some((el) => el === null)) {
    return null;
  }

  return {
    target: eligibleFillable.exportedAs,
    values: values as Value[],
  };
};

export const tryFillTypedEligibleFillable = (
  eligibleFillable: TypedEligibleFillableMember,
  getValue: ValueGetter,
): TypedFunctionFill | null => {
  const fill = tryFillEligibleFillable(eligibleFillable, getValue);

  return fill ? { ...fill, blueprints: eligibleFillable.blueprints } : null;
};

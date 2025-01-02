import ts from 'typescript';
import { DependencyContext } from './structs.js';

/**
 * An Interest is an independent Node evaluation ruleset.
 * The Guard verifies whether a node is eligible for further Processing,
 * which may or may not yield results.
 */
export type Interest<T extends ts.Node> = [
  InterestGuard<T>,
  InterestProcessor<T>,
];

export type InterestProcessorContext = DependencyContext & {
  typeChecker: ts.TypeChecker;
};

export type InterestGuard<T extends ts.Node> = (node: ts.Node) => node is T;
export type InterestProcessor<T extends ts.Node> = (
  node: T,
  context: InterestProcessorContext,
) => void;

import ts from 'typescript';
import { Interest, InterestProcessorContext } from './interest.js';

export const interestIterator =
  (interests: Interest<ts.Node>[], context: InterestProcessorContext) =>
  (node: ts.Node): void =>
    applyInterests(node, interests, context);

export const applyInterests = (
  node: ts.Node,
  interests: Interest<ts.Node>[],
  context: InterestProcessorContext,
): void => {
  interests.forEach(([guard, process]) => {
    if (guard(node)) {
      process(node, context);
    }
  });
};

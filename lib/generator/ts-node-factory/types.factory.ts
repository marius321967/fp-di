import ts from 'typescript';
import { Blueprints } from '../../types.js';

export const createIntersectionTypeFromBlueprints = (
  blueprints: Blueprints,
): ts.IntersectionTypeNode =>
  ts.factory.createIntersectionTypeNode(
    blueprints.map((blueprint) =>
      ts.factory.createTypeReferenceNode(blueprint.exportedAs),
    ),
  );

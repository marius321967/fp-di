import { FillFileSyntax, FillSyntax } from './structs';

export const addFillToFile = (
  fillFile: FillFileSyntax,
  fill: FillSyntax,
): FillFileSyntax => {
  return {
    fillExportNodes: [...fillFile.fillExportNodes, fill.fillExportNode],
    importNodes: [...fillFile.importNodes, ...fill.importNodes],
  };
};

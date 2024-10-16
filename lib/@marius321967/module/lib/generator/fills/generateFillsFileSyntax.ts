import { addFillToFile } from './addFillToFile';
import { generateFillSyntax } from './generateFillSyntax';
import { FilledFunction, FillFileSyntax } from './structs';

export const generateFillsFile = (
  fills: FilledFunction[],
  fillPath: string,
): FillFileSyntax => {
  let fillFileSyntax: FillFileSyntax = { fillExportNodes: [], importNodes: [] };

  fills
    .map((filledFunction) => generateFillSyntax(filledFunction, fillPath))
    .forEach((fillSyntax) => {
      fillFileSyntax = addFillToFile(fillFileSyntax, fillSyntax);
    });

  return fillFileSyntax;
};

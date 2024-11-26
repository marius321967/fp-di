import { FunctionFillMember } from '../../parser/fills/structs.js';
import { addFillToFile } from './addFillToFile.js';
import { generateFillSyntax } from './generateFillSyntax.js';
import { FillFileSyntax } from './structs.js';

export const generateFillsFile = (
  fills: FunctionFillMember[],
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

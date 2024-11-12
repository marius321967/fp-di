import { FunctionFillMember } from '../../parser/fills/structs';
import { addFillToFile } from './addFillToFile';
import { generateFillSyntax } from './generateFillSyntax';
import { FillFileSyntax } from './structs';

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

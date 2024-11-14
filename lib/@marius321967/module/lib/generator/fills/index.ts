import fs from 'fs';
import { TypedFunctionFillMember } from '../../parser/fills/structs';
import { printFile } from '../printFile';
import { generateFillsFile } from './generateFillsFileSyntax';

type ModuleFills = {
  [fillFilePath: string]: TypedFunctionFillMember[];
};

export const compileFills = (fills: TypedFunctionFillMember[]): void => {
  const moduleFills: ModuleFills = groupModuleFills(fills);

  Object.entries(moduleFills).forEach(([fillFilePath, fills]) => {
    const fillFileSyntax = generateFillsFile(fills, fillFilePath);

    const sourceText = printFile([
      ...fillFileSyntax.importNodes,
      ...fillFileSyntax.fillExportNodes,
    ]);

    fs.writeFileSync(fillFilePath, sourceText);
  });
};

const groupModuleFills = (fills: TypedFunctionFillMember[]): ModuleFills => {
  const result: ModuleFills = {};

  fills.forEach((fill) => {
    const entry = result[fill.exportedAs.filePath];

    result[fill.exportedAs.filePath] = entry ? [...entry, fill] : [fill];
  });

  return result;
};

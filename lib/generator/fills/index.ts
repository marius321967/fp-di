import fs from 'fs/promises';
import { TypedFunctionFillMember } from '../../parser/fills/structs.js';
import { printFile } from '../printFile.js';
import { generateFillsFile } from './generateFillsFileSyntax.js';

type ModuleFills = {
  [fillFilePath: string]: TypedFunctionFillMember[];
};

export const compileFills = (
  fills: TypedFunctionFillMember[],
): Promise<void> => {
  const moduleFills: ModuleFills = groupModuleFills(fills);

  const fileWrites = Object.entries(moduleFills).map<Promise<void>>(
    ([fillFilePath, fills]) => {
      const fillFileSyntax = generateFillsFile(fills, fillFilePath);

      const sourceText = printFile([
        ...fillFileSyntax.importNodes,
        ...fillFileSyntax.fillExportNodes,
      ]);

      return fs.writeFile(fillFilePath, sourceText);
    },
  );

  return Promise.all(fileWrites).then();
};

const groupModuleFills = (fills: TypedFunctionFillMember[]): ModuleFills => {
  const result: ModuleFills = {};

  fills.forEach((fill) => {
    const entry = result[fill.member.filePath];

    result[fill.member.filePath] = entry ? [...entry, fill] : [fill];
  });

  return result;
};

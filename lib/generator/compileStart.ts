import fs from 'fs/promises';
import { FunctionFill } from '../parser/fills/structs.js';
import { generateStartSyntax } from './fills/generateStartSyntax.js';
import { printFile } from './printFile.js';

export const compileStart = (
  entrypointFill: FunctionFill,
  startPath: string,
): Promise<void> => {
  const startSyntax = generateStartSyntax(entrypointFill, startPath);

  const source = printFile([
    ...startSyntax.importNodes,
    startSyntax.entrypointCallNode,
  ]);

  return fs.writeFile(startPath, source);
};

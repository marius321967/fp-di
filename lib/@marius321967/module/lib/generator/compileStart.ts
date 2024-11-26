import fs from 'fs';
import { FunctionFill } from '../parser/fills/structs.js';
import { generateStartSyntax } from './fills/generateStartSyntax.js';
import { printFile } from './printFile.js';

export const compileStart = (
  entrypointFill: FunctionFill,
  startPath: string,
): void => {
  const startSyntax = generateStartSyntax(entrypointFill, startPath);

  const source = printFile([
    ...startSyntax.importNodes,
    startSyntax.entrypointCallNode,
  ]);

  fs.writeFileSync(startPath, source);
};

import fs from 'fs';
import { FunctionFill } from '../parser/fills/structs';
import { generateStartSyntax } from './generateStartSyntax';
import { printFile } from './printFile';

export const generateStart = (
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

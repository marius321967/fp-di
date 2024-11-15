import path from 'path';
import ts from 'typescript';
import { PreparedProgram } from './types';

export const getStartPath = (entrypointPath: string): string => {
  const programDir = path.dirname(entrypointPath);

  return path.join(programDir, 'start.ts');
};

export const getParsedConfig = (
  basePath: string,
  configFilename: string,
): ts.ParsedCommandLine =>
  ts.parseJsonSourceFileConfigFileContent(
    ts.readJsonConfigFile(configFilename, ts.sys.readFile),
    ts.sys,
    basePath,
  );

export const prepareProgram = (programDir: string): PreparedProgram => {
  const config = getParsedConfig(programDir, programDir + '/tsconfig.json');

  const programFiles = config.fileNames.filter(
    (path) => !path.endsWith('.fill.ts'),
  );

  const programEntrypointPath = programDir + '/test-program.ts';
  const program = ts.createProgram([programEntrypointPath], config.options);

  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length > 0) {
    throw new Error('Program has syntax errors');
  }

  return {
    program,
    programFiles,
    programEntrypointPath,
  };
};

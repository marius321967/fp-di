import ts from 'typescript';

export const getParsedConfig = (
  basePath: string,
  configFilename: string,
): ts.ParsedCommandLine =>
  ts.parseJsonSourceFileConfigFileContent(
    ts.readJsonConfigFile(configFilename, ts.sys.readFile),
    ts.sys,
    basePath,
  );

export const prepareProgram = (
  programDir: string,
): {
  program: ts.Program;
  programFiles: string[];
  programEntrypointPath: string;
} => {
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

export const filterNotNull = <T>(value: T | null): value is T => value !== null;

export function assertIsPresent<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

export const symbolAtLocationGetter =
  (typeChecker: ts.TypeChecker) =>
  (node: ts.Node): ts.Symbol => {
    const symbol = typeChecker.getSymbolAtLocation(node);

    assertIsPresent(symbol, `Symbol not found for node [${node.getText()}]`);

    return symbol;
  };

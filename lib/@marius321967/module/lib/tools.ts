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

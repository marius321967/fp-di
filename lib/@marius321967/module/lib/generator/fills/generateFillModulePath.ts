import path from 'path';

export const generateFillModulePath = (targetPath: string): string => {
  const targetDir = path.dirname(targetPath);
  const moduleName = path.basename(targetPath, '.ts');
  return `${targetDir}/${moduleName}.fill.ts`;
};

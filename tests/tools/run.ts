import { exec } from 'child_process';

const nodeMajorVersion = parseInt(process.versions.node.split('.')[0]);

export const run = (path: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const tsNodeLoadOption = nodeMajorVersion >= 20 ? 'require' : 'loader';

    exec(`node --${tsNodeLoadOption}=ts-node/esm ${path}`, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });

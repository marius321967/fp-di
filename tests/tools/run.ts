import { exec } from 'child_process';

export const run = (path: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(`ts-node-esm ${path}`, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });

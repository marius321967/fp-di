import { ExportAs } from './types.js';

export type ImportContext = {
  /** Relative path */
  modulePath: string;
  importAs: string;
  exportedAs: ExportAs;
};

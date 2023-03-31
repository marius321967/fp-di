import * as fs from 'fs';
// import { registerBuilder } from './di.js';
export type Token<T> = symbol;
export type Builder<T> = (...args: any[]) => T;

// export type Injector = <T>(token: Token<T>) => T;
export type BuilderRegistrator = <T>(
  builder: Builder<T>,
  token?: Token<T>
) => Token<T>;
// export type Registrator = <T>(token: Token<T>, value?: T) => void;

// export const registerBuilder: BuilderRegistrator = (builder, symbol) => {};
// export const register: Registrator = ();

type Calculator = (a: number, b: number) => number;

const base =
  (filesystem: typeof fs): Calculator =>
  (a, b) =>
    a + b;

// registerBuilder<Calculator>(base);

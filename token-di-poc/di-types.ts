export type Token<T> = { symbol: symbol };
export type Builder<T> = (...args: any[]) => T;

export type Injector = <T>(token: Token<T>) => T;

export type BuilderRegistrator = <T>(
  builder: Builder<T>,
  token?: Token<T>
) => Token<T>;

export type ValueRegistrator = <T>(value: T, token?: Token<T>) => Token<T>;

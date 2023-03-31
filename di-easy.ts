import {
  Builder,
  BuilderRegistrator,
  Token,
  ValueRegistrator,
} from './di-types.js';

const collection: { [key: symbol]: Builder<any> } = {};

export const registerBuilder: BuilderRegistrator = <T>(
  builder: Builder<T>,
  token?: Token<T>
): Token<T> => {
  if (!token) token = { symbol: Symbol() };
  collection[token.symbol] = builder;

  return token;
};

export const registerValue: ValueRegistrator = <T>(
  value: T,
  token?: Token<T>
): Token<T> => {
  if (!token) token = { symbol: Symbol() };
  collection[token.symbol] = () => value;

  return token;
};

export const inject = <T>(token: Token<T>): T => {
  return collection[token.symbol]();
};

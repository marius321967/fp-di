import { Builder, BuilderRegistrator, Token } from './registry-types.mvp';

const collection: { [key: symbol]: Builder<any> } = {};

export const registerBuilder: BuilderRegistrator = <T>(
  builder: Builder<T>,
  token?: Token<T>,
): Token<T> => {
  if (!token) token = Symbol();
  collection[token as symbol] = builder;

  return token;
};

export const registerValue: BuilderRegistrator = <T>(
  value: T,
  token?: Token<T>,
): Token<T> => {
  if (!token) token = Symbol();
  collection[token as symbol] = () => value;

  return token;
};

export const inject = <T>(token: Token<T>): T => {
  if (!((token as symbol) in collection)) {
    const tokenName = token
      .toString()
      .substring(7, token.toString().length - 1);

    throw new Error(`DI container does not have a value for [${tokenName}]`);
  }

  return collection[token as symbol](inject);
};

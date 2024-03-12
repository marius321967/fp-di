import { inject, registerBuilder, registerValue } from './di-easy.js';

export type UserNameGetter = (id: string) => string;

export type User = { name: string };
export type UserGetter = (id: string) => User;

export const base =
  (getUser: UserGetter): UserNameGetter =>
  (id) =>
    getUser(id).name;

const token = registerBuilder<UserNameGetter>(base);

console.log(inject(token)('foobar'));

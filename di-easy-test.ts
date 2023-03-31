import { inject, registerBuilder, registerValue } from './di-easy.js';

export type FooFunc = (a: number, b: number) => number;

export const base =
  (outsideService): FooFunc =>
  (a, b) =>
    a + b;

const token = registerBuilder<FooFunc>(base);
const token2 = registerValue<FooFunc>(base([]));

console.log(inject(token)(1, 2));
console.log(inject(token2)(1, 2));

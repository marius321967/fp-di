import { assert } from 'chai';
import * as Sinon from 'sinon';
import { inject, registerBuilder, registerValue } from '..';
import { Builder, Token } from '../di-types.js';

type User = { name: string };
type UserGetter = () => User;

const userGetter: UserGetter = () => ({ name: 'Mr. Foo' });

describe('index', () => {
  it('direct registration and injection works', () => {
    const token = Symbol() as Token<UserGetter>;

    registerValue(userGetter, token);

    const result = inject(token);

    assert.equal(result, userGetter);
  });

  it('builder registration and injection works', () => {
    const token = Symbol() as Token<UserGetter>;
    const builder: Builder<UserGetter> = Sinon.stub().returns(userGetter);

    registerBuilder(builder, token);

    const result = inject(token);

    assert.equal(result, userGetter);
    Sinon.assert.calledWithExactly(builder as Sinon.SinonSpy, inject);
  });

  it('should throw error when injecting unknown value', () => {
    const token = Symbol('foo') as Token<UserGetter>;
    const action = () => inject(token);
    assert.throws(action, 'DI container does not have a value for [foo]');
  });
});

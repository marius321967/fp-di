import { expect } from 'chai';
import { transform } from '../../cli/transform.js';
import { run } from '../tools/run.js';

describe('optional-parameters', function () {
  this.timeout(10_000);

  beforeEach(() => {
    transform({
      programDir: 'tests/e2e/optional-parameters',
    });
  });

  it('should', async () => {
    const result = await run('./tests/e2e/optional-parameters/start.ts');

    expect(result.trim()).to.equal(
      'Email host: http://my-email-service:3000, SMS host: undefined',
    );
  });
});

import { assert, expect } from 'chai';
import ts, { NamedImports } from 'typescript';
import { ExportAs } from '../../types.js';
import { createImportClauseFromContext } from './imports.factory.js';

describe('createImportClauseFromContext', () => {
  it('should return default import clause when target exported as default', () => {
    const importAs = 'foo';
    const exportedAs: ExportAs = { type: 'default' };

    const result = createImportClauseFromContext({ importAs, exportedAs });

    expect(result.namedBindings).to.be.undefined;
    expect(result.name).to.deep.equal(ts.factory.createIdentifier(importAs));
  });

  it('should return simple named import when target exported with name', () => {
    const importAs = 'foo';
    const exportedAs: ExportAs = { type: 'named', name: 'foo' };

    const result = createImportClauseFromContext({ importAs, exportedAs });

    assert.isDefined(result.namedBindings);
    const importSpecifier = (result.namedBindings as NamedImports).elements[0];
    expect(importSpecifier.name.escapedText).to.equal('foo');
    expect(importSpecifier.propertyName).to.be.undefined;
  });

  it('should import under different name when import name does not match target export name', () => {
    // TODO
  });
});

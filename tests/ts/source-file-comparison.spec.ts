import { assert, expect } from 'chai';
import { dirname } from 'path';
import { createProgram } from 'typescript';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('node.getSourceFile() should return the exact same object for same file, not a copy of the SourceFile object', () => {
  const program = createProgram(
    [__dirname + '/sample-program.ts', __dirname + '/sample-program-2.ts'],
    {},
  );
  program.getTypeChecker();

  it('main test', () => {
    const sourceFile = program.getSourceFile(__dirname + '/sample-program.ts');

    if (!sourceFile) {
      assert.fail('Could not parse sample program for test');
    }

    const nodes = sourceFile.getChildren()[0].getChildren();

    expect(nodes.length).to.equal(2);
    expect(nodes[0].getText()).to.equal('const x = 1;');
    expect(nodes[1].getText()).to.equal('const y = 2;');

    expect(nodes[0].getSourceFile() === nodes[1].getSourceFile()).to.equal(
      true,
    );
  });

  it('nodes from different files should return different getSourceFile (just in case)', () => {
    const sourceFile1 = program.getSourceFile(__dirname + '/sample-program.ts');
    const sourceFile2 = program.getSourceFile(
      __dirname + '/sample-program-2.ts',
    );

    if (!sourceFile1 || !sourceFile2) {
      assert.fail('Could not parse sample program for test');
    }

    expect(
      sourceFile1.getChildren()[0].getSourceFile() ===
        sourceFile2.getChildren()[0].getSourceFile(),
    ).to.equal(false);
  });
});

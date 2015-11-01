# Stu

> A shoddy replacement for jest that works with mocha and sinon but is way
> faster.

Basically it allows you to stub entire modules that are required by the file
you are testing.

## Installation

```
npm install --save-dev stu
```

## Usage

```
import stu from 'stu';
import {expect} from 'chai';

describe('something', () => {
  let cleanup;

  let thing;
  let stuff;

  beforeEach(() => {
    cleanup = stu((mock, require) => {
      thing = mock('../thing');
      stuff = test('../stuff');
    });
  });

  after(() => cleanup());

  it('should do stuff with thing', () => {
    stuff.returns(true);

    thing();

    expect(stuff.args).to.deep.equal([
      ['a', 'b', 'c'],
    ]);
  });

});
```

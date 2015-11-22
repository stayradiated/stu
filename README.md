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

``` javascript
import stu from 'stu';
import expect from 'expect';

describe('something', () => {
  let thing;
  let stuff;

  const modules = stu((mock, test) => {
    thing = mock('../thing');
    stuff = test('../stuff');
  });

  beforeEach(modules.mock);
  after(modules.flush);

  it('should do stuff with thing', () => {
    stuff.returns(true);

    thing();

    expect(stuff.args).toEqual([['a', 'b', 'c']]);
  });

});
```

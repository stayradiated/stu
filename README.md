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
  let library;
  let mycode;

  stu((mock, test) => {
    library = mock('library');
    mycode = test('../mycode');
  }).mocha();

  it('should do stuff with thing', () => {
    library.returns('some value');

    mycode();

    expect(library.args).toEqual([['a', 'b', 'c']]);
  });
});
```

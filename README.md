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
import test from 'ava';
import * as stu from 'stu';

test.beforeEach((t) => {
  t.context = {
    ...t.context,
    library: stu.mock('library'),
    mycode: stu.test('../mycode')
  };
})

test('should do stuff with thing', (t) => {
    const { library, mycode } = t.context;

  library.returns('some value');
  mycode();
  t.deepEqual(library.args, [['a', 'b', 'c']]);
});
```

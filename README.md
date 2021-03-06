genify
======
[![Build Status](https://travis-ci.org/ivpusic/genify.svg?branch=master)](https://travis-ci.org/ivpusic/genify)

Bringing power of javascript generators into normal javascript environment

### Installation

```
npm install genify
```

### Example

```JavaScript
var Q = require('q');
var fs = require('fs');
var genify = require('genify');

// wrap your object into genify function
var object = genify({
  concatFiles: function * (file1, file2, outFile) {
    file1 = yield Q.nfcall(fs.readFile, file1);
    file2 = yield Q.nfcall(fs.readFile, file2);
    var concated = file1 + file2;

    yield Q.nfcall(fs.writeFile, outFile, concated);

    return concated;
  }
});

// concatFiles is generator function, and it is using generator power to do some things,
// and here you are using that power inside normal javascript environment,
// handling results and errors using promises
object.concatFiles('./somefile1.txt', './somefile2.txt', './concated.txt').then(function (res) {
  // do something with result
}, function (err) {
  // do something with error
});

```

### Options
```
throwable: (true|false)
```

After some error occours in generator function, by default error will be passed to caller as rejected promise.
If you want for error to be thrown instead, you should set ``throwable`` option to ``true``.

##### Example
```Javascript
genify(someObject, {
	// errors will be thrown
	throwable: true
})
```

# License
**MIT**

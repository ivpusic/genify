genify
======

Wrapping object generator properties into co

### Example

```JavaScript
var Q = require('q');
var fs = require('fs');
var co = require('co');
var genify = require('genify');

// genify is taking care of wrapping all object generator properties into co function,
// and returning generator result as resolved promise, 
// or in case of error -> rejected promise with error object
var object = genify({
  readFile: function * (file) {
    return yield Q.nfcall(fs.readFile, file);
  }
});

co(function * () {
  console.log(yield object.readFile('./somefile.txt'));
})();
```

# License
**MIT**

genify
======

Wrapping object generator properties into co

### Example

```
var Q = require('q');
var fs = require('fs');
var co = require('co');
var genify = require('genify');

var object = genify({
  readFile: function * (file) {
    return yield Q.nfcall(fs.readFile, file);
  }
});

co(function * () {
  console.log(yield object.readFile('./somefile.txt'));
})();
```

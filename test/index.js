'use strict';

require('co-mocha');
var genify = require('..');
var Q = require('q');
var fs = require('fs');

describe('genify', function () {
  describe('simple test', function () {
    var object;

    before(function () {
      object = {
        sumPromise: function * (number1, number2) {
          var res = (yield new Q(number1)) + (yield new Q(number2));
          return new Q(res);
        },

        sumRaw: function * (number1, number2) {
          return (yield new Q(number1)) + (yield new Q(number2));
        },

        normalMethod: function () {
          return 2;
        },

        property: 5,

        propertyNull: null,

        propertyUndefined: undefined
      };

      object = genify(object);
    });

    it('should keep all object properties', function () {
      object.should.have.property('sumPromise');
      object.should.have.property('sumRaw');
      object.should.have.property('normalMethod');
      object.should.have.property('property');
      object.should.have.property('propertyNull');
      object.should.have.property('propertyUndefined');
    });

    it('should make able to read properties, generator and function values', function * () {
      object.property.should.be.exactly(5);
      (object.propertyNull === null).should.be.true;
      (object.propertyUndefined === undefined).should.be.true;

      object.normalMethod().should.be.exactly(2);
      object.normalMethod().should.be.exactly(2);

      var res = yield object.sumPromise(4, 5);
      res.should.be.exactly(9);
    });

    it('should work even if we are not returning promise from function', function * () {
      var res = yield object.sumRaw(10, 15);
      res.should.be.exactly(25);
    });
  });

  describe('intermediate test', function () {
    var object;

    before(function () {
      object = {
        readFile: function * (file) {
          return yield Q.nfcall(fs.readFile, file);
        }
      };

      object = genify(object);
    });

    it('should be able to read file content using generators', function * () {
      var content = yield object.readFile('./test/test.txt');
      if (content) {
        content = content.toString();
      }
      content.should.be.exactly('this is some content');
    });

    it('should throw meaningful error', function * () {
      try {
        var content = yield object.readFile('./test/unknown_file.txt');
      } catch (ex) {
        // TODO: find something better!!!
        ex.stack.should.be.exactly('Error: ENOENT, open \'./test/unknown_file.txt\'');
      }
    });
  });
});

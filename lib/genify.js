'use strict';

var co = require('co');
var Q = require('q');

/**
 * Wrap object method into co function,
 * and return result as promise
 *
 * @param {Function} fn Function to convert
 * @param {Object} ctx object which contains function
 * @returns {Promise}
 *
 * @api private
 */

function toGenerator(fn, ctx, opts) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var defer = Q.defer();

    co(function * () {
      return yield fn.apply(ctx, args);
    })(function (err, res) {
      if (err) {
        if (opts.throwable) {
          throw err;
        }

        return defer.reject(err);
      }
      return defer.resolve(res);
    });

    return defer.promise;
  };
}

/**
 * Main function for wrapping object generator methods inside co function
 *
 * @param {Object} obj Object to wrap
 * @param {Object} opts Module options
 *
 * @api public
 */

module.exports = function (obj, opts) {
  opts = opts || {};

  for (var key in obj) {
    if (obj[key] && obj[key].constructor && obj[key].constructor.name === 'GeneratorFunction') {
      var fn = obj[key];
      obj[key] = toGenerator(fn, obj, opts);
    }
  }

  return obj;
};

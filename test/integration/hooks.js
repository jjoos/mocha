var assert = require('assert');
var run    = require('./helpers').runMocha;
var args   = [];

describe('hooks', function() {
  this.timeout(1000);

  it('are ran in correct order', function(done) {
    run('cascade.js', args, function(err, res) {
      var lines, expected;

      assert(!err);

      lines = res.output.split(/[\n․]+/).map(function(line) {
        return line.trim();
      }).filter(function(line) {
        return line.length;
      }).slice(0, -1);

      expected = [
        'before one',
        'before two',
        'before three',
        'before each one',
        'before each two',
        'before each three',
        'TEST three',
        'after each three',
        'after each two',
        'after each one',
        'after three',
        'after two',
        'after one'
      ];

      expected.forEach(function(line, i) {
        assert.equal(lines[i], line);
      });

      assert.equal(res.code, 0);
      done();
    });
  });

  describe('afterEach sets tests to fail', function() {
    var res;
    before(function(done) {
      run('hooks/afterEach.hook.failure.js', args, function(err, result) {
        res = result;
        done(err);
      });
    });

    it('afterEach can set a test to fail', function() {
      assert.equal(res.pending, 0);
      assert.equal(res.passing, 1);
      assert.equal(res.failing, 2);
      assert.equal(res.code, 2);
    });
  });
});

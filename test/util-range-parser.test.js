var parser = require('../');
var should = require('should');

describe('util-range-parser', function() {
  describe('pattern recognition', function() {
    var cases = {
      '[11..]': 1,
      '[11,22..]': 11,
      '[11..22]': 1,
      '[11,22..33]': 11
    };

    Object.keys(cases).forEach(function(test) {
      it(test, function() {
        var res = parser(test);
        should.exist(res);
        cases[test].should.eql(res.step);
      });
    });
  });

  describe('toArray', function() {
    describe('-valid', function() {
      var cases = {
        // no range
        '[11]': {pattern:[11],hasRange:false},
        '[11,22,33,44]': {pattern:[11,22,33,44],hasRange:false},

        // unbounded
        '[11..]': {pattern: [11],hasRange:true},
        '[11,22..]': {pattern:[11,22], hasRange:true},
        '[11,33,55..]': {pattern:[11,33,55],hasRange:true},
        '[11,22,333,444,5555..]': {pattern:[11,22,333,444,5555],hasRange:true},

        // bounded
        '[11..100]': {pattern:[11],end:100,hasRange:true,hasEnd:true},
        '[11,22..100]': {pattern:[11,22],end:100,hasRange:true,hasEnd:true},
        '[11,33,55..100]': {pattern:[11,33,55],end:100,hasRange:true,hasEnd:true},
        '[11,22,33,44,55..100]': {pattern:[11,22,33,44,55],end:100,hasRange:true,hasEnd:true},

        // spaces
        '[11 , 22]': {pattern:['11', '22'],hasRange:false},
        '[  11 , 22  , 33 .. 66       ]': {pattern:[11,22,33],end:66,hasRange:true,hasEnd:true}
      };

      Object.keys(cases).forEach(function(test) {
        it(test, function() {
          var res = parser.toArray(test);
          should.exist(res);
          cases[test].should.eql(res);
        });
      });
    });

    describe('-invalid', function() {
      var cases = [
        // missing begin
        '1..]',
        '1,2..]',
        '1,2,3..]',
        '1..10]',
        '1,2..10]',
        '1,2,3..10]',

        // missing ending
        '[1..',
        '[1,2..',
        '[1,2,3..',
        '[1..10',
        '[1,2..10',
        '[1,2,3..10',

        // crazy commas
        '[1,,]',
        '[1,,2]',
        '[1,2,3..10,]',

        // periods
        '[1...2]',
        '[1,2...10]',
        '[1.10]',
        '[1,2.10]',

        // more than one ending
        '[1..10,11]',
        '[1,2..10,11]',

        // spaces in numbers
        '[1 2 3 4 5]'
      ];

      cases.forEach(function(test) {
        it(test, function() {
          var res = parser.toArray(test);
          should.not.exist(res);
        });
      });
    });
  });
});

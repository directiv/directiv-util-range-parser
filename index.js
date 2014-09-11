/**
 *
 */

/**
 * Match a string against a range expression
 *
 * Examples:
 *  [1..3]
 *  [1,3..7]
 *  [1,3..]
 */

exports = module.exports = function(str) {
  var res = toArray(str);
  if (!res || !res.hasRange) return res;
  var pattern = res.pattern;
  var length = pattern.length;
  var end = res.end;
  if (length === 1) {
    if (res.hasEnd) res.step = pattern[0] < end ? 1 : -1;
    else res.step = 1;
  }
  else if (length === 2) res.step = pattern[1] - pattern[0];
  else throw new Error('More than two numbers in a pattern is not supported at this time');
  return res;
};

// exports.regexp = /\[\s*(\d+)\s*(?:,\s*(\d+)\s*)*(\.\.)\s*(\d+)?\]/;

var states = {
  NUMBER: 1,
  COMMA: 2,
  FINAL: 3
};

var numbers = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0'
];

var toArray = exports.toArray = function(str) {
  var items = [];
  var current = '';
  var expect = states.NUMBER;
  var hasRange = false;

  if (str.charAt(0) !== '[' || str.charAt(str.length - 1) !== ']') return null;

  for (var i = 1; i < str.length - 1; i++) {
    var c = str.charAt(i);

    if (c === ',' && expect === states.NUMBER && current !== '') {
      items.push(parseInt(current, 10));
      current = '';
      continue;
    }

    if (c === '.' && str.charAt(i + 1) === '.' && expect === states.NUMBER && current !== '') {
      items.push(parseInt(current, 10));
      hasRange = true;
      current = '';
      expect = states.FINAL;
      i++;
      continue;
    }

    if (c === ' ') continue;

    if (!~numbers.indexOf(c) && (expect === states.NUMBER || expect === states.FINAL)) return null;

    current += c;
  }

  if (current !== '' && !hasRange) {
    items.push(parseInt(current, 10));
    return {
      pattern: items,
      hasRange: hasRange
    };
  }
  if (current !== '') return {
    pattern: items,
    hasRange: hasRange,
    hasEnd: true,
    end: parseInt(current, 10)
  };
  return {
    hasRange: hasRange,
    pattern: items
  };
};

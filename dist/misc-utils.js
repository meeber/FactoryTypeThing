"use strict";

var _upperFirst = require("lodash/upperFirst");

var _upperFirst2 = _interopRequireDefault(_upperFirst);

var _isString = require("lodash/isString");

var _isString2 = _interopRequireDefault(_isString);

var _findIndex = require("lodash/findIndex");

var _findIndex2 = _interopRequireDefault(_findIndex);

var _values = require("lodash/values");

var _values2 = _interopRequireDefault(_values);

var _isObject = require("lodash/isObject");

var _isObject2 = _interopRequireDefault(_isObject);

var _isArray = require("lodash/isArray");

var _isArray2 = _interopRequireDefault(_isArray);

var _keys = require("lodash/keys");

var _keys2 = _interopRequireDefault(_keys);

var _flatMap = require("lodash/flatMap");

var _flatMap2 = _interopRequireDefault(_flatMap);

var _union = require("lodash/union");

var _union2 = _interopRequireDefault(_union);

var _isFunction = require("lodash/isFunction");

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Doesn't work well with uglify unless its --keep-fnames is used.
function isProbablyClass(value) {
  return (0, _isFunction2.default)(value) && startsUppercase(value.name);
}

function keysUnion() {
  for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }

  return (0, _union2.default)((0, _flatMap2.default)(objects, obj => (0, _keys2.default)(obj)));
}

function onlyHasStrings(value) {
  let array = (0, _isArray2.default)(value) ? value : (0, _isObject2.default)(value) ? (0, _values2.default)(value) : undefined;

  return (0, _findIndex2.default)(array, i => !(0, _isString2.default)(i)) == -1;
}

function startsUppercase(value) {
  return (0, _isString2.default)(value) && value.length >= 1 && value == (0, _upperFirst2.default)(value);
}

module.exports = {
  isProbablyClass,
  keysUnion,
  onlyHasStrings,
  startsUppercase
};
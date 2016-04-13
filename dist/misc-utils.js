"use strict";

var _values2 = require("lodash/values");

var _values3 = _interopRequireDefault(_values2);

var _upperFirst2 = require("lodash/upperFirst");

var _upperFirst3 = _interopRequireDefault(_upperFirst2);

var _union2 = require("lodash/union");

var _union3 = _interopRequireDefault(_union2);

var _keys2 = require("lodash/keys");

var _keys3 = _interopRequireDefault(_keys2);

var _isString2 = require("lodash/isString");

var _isString3 = _interopRequireDefault(_isString2);

var _isObject2 = require("lodash/isObject");

var _isObject3 = _interopRequireDefault(_isObject2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isArray2 = require("lodash/isArray");

var _isArray3 = _interopRequireDefault(_isArray2);

var _flatMap2 = require("lodash/flatMap");

var _flatMap3 = _interopRequireDefault(_flatMap2);

var _findIndex2 = require("lodash/findIndex");

var _findIndex3 = _interopRequireDefault(_findIndex2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Doesn't work well with uglify unless its --keep-fnames is used.
function isProbablyClass(value) {
  return (0, _isFunction3.default)(value) && startsUppercase(value.name);
}

function keysUnion(...objects) {
  return (0, _union3.default)((0, _flatMap3.default)(objects, obj => (0, _keys3.default)(obj)));
}

function onlyHasStrings(value) {
  let array = (0, _isArray3.default)(value) ? value : (0, _isObject3.default)(value) ? (0, _values3.default)(value) : undefined;

  return (0, _findIndex3.default)(array, i => !(0, _isString3.default)(i)) === -1;
}

function startsUppercase(value) {
  return (0, _isString3.default)(value) && value.length >= 1 && value === (0, _upperFirst3.default)(value);
}

module.exports = {
  isProbablyClass,
  keysUnion,
  onlyHasStrings,
  startsUppercase
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _has = require("lodash/has");

var _has2 = _interopRequireDefault(_has);

var _forEach = require("lodash/forEach");

var _forEach2 = _interopRequireDefault(_forEach);

var _isFunction = require("lodash/isFunction");

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isArray = require("lodash/isArray");

var _isArray2 = _interopRequireDefault(_isArray);

var _isString = require("lodash/isString");

var _isString2 = _interopRequireDefault(_isString);

var _isObject = require("lodash/isObject");

var _isObject2 = _interopRequireDefault(_isObject);

var _isUndefined = require("lodash/isUndefined");

var _isUndefined2 = _interopRequireDefault(_isUndefined);

exports.default = createFactory;

var _miscUtils = require("./misc-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFER = Symbol();

function createFactory() {
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Private ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  let creators = new Map();

  function isValidDeps(deps) {
    return (0, _isUndefined2.default)(deps) ? true : (0, _isObject2.default)(deps) ? (0, _miscUtils.onlyHasStrings)(deps) : false;
  }

  // Technically any type of key would work since Map allows anything. But keys
  // like undefined and NaN open door to sneaky bugs so no thanks.
  function isValidKey(key) {
    return (0, _isString2.default)(key);
  }

  function isValidParams(params, deps) {
    return (0, _isUndefined2.default)(params) ? true : (0, _isArray2.default)(params) ? (0, _isArray2.default)(deps) || (0, _isUndefined2.default)(deps) : (0, _isObject2.default)(params) ? !(0, _isArray2.default)(deps) : false;
  }

  function isValidType(type) {
    return type == "class" || type == "factory" || type == "singleton";
  }

  function isValidValue(value, type) {
    return type == "class" || type == "factory" ? (0, _isFunction2.default)(value) : type == "singleton";
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Public ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  function create(key, params) {
    let creator = getCreator(key);

    if (creator.type == "singleton") return creator.value;

    let finalParams = resolveDeps(creator.deps, params);

    if (creator.type == "class") return new creator.value(...finalParams);

    return creator.value(...finalParams);
  }

  function getCreator(key) {
    if (!isRegistered(key)) throw ReferenceError();

    return creators.get(key.toLowerCase());
  }

  function isRegistered(key) {
    if (!isValidKey(key)) throw TypeError();

    return creators.has(key.toLowerCase());
  }

  function register(value, deps) {
    if (!(0, _isFunction2.default)(value)) throw TypeError();
    if (!(0, _isString2.default)(value.name) || !value.name.length) throw TypeError();

    if ((0, _miscUtils.isProbablyClass)(value)) registerClass(value.name, value, deps);else registerFactory(value.name, value, deps);
  }

  function registerClass(key, classFn, deps) {
    setCreator("class", key, classFn, deps);
  }

  function registerFactory(key, factoryFn, deps) {
    setCreator("factory", key, factoryFn, deps);
  }

  function registerSingleton(key, singleton) {
    setCreator("singleton", key, singleton);
  }

  // Room for minor performance gains here by using a different algorithm for
  // each combination (array|non-array object|undefined) of deps and params.
  function resolveDeps(deps, params) {
    if (!isValidParams(params, deps)) throw TypeError();

    let finalParams = (0, _isArray2.default)(deps) || (0, _isArray2.default)(params) ? [] : {};

    (0, _forEach2.default)((0, _miscUtils.keysUnion)(deps, params), i => {
      finalParams[i] = (0, _has2.default)(params, i) && params[i] != DEFER ? params[i] : (0, _has2.default)(deps, i) ? create(deps[i]) : undefined;
    });

    // Wrapping finalParams in an array if it's a non-array object lets us use
    // same "...finalParams" syntax for both positional and named parameters.
    return (0, _isArray2.default)(finalParams) ? finalParams : [finalParams];
  }

  function setCreator(type, key, value, deps) {
    if (!isValidType(type)) throw TypeError();
    if (!isValidKey(key)) throw TypeError();
    if (!isValidValue(value, type)) throw TypeError();
    if (!isValidDeps(deps)) throw TypeError();

    creators.set(key.toLowerCase(), { type, value, deps });
  }

  return {
    create,
    DEFER,
    getCreator,
    isRegistered,
    register,
    registerClass,
    registerFactory,
    registerSingleton,
    setCreator
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isUndefined2 = require("lodash/isUndefined");

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _isString2 = require("lodash/isString");

var _isString3 = _interopRequireDefault(_isString2);

var _isObject2 = require("lodash/isObject");

var _isObject3 = _interopRequireDefault(_isObject2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isArray2 = require("lodash/isArray");

var _isArray3 = _interopRequireDefault(_isArray2);

var _has2 = require("lodash/has");

var _has3 = _interopRequireDefault(_has2);

var _forEach2 = require("lodash/forEach");

var _forEach3 = _interopRequireDefault(_forEach2);

exports.default = createFactory;

var _miscUtils = require("./misc-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFER = Symbol();

function isValidDeps(deps) {
  return (0, _isUndefined3.default)(deps) ? true : (0, _isObject3.default)(deps) ? (0, _miscUtils.onlyHasStrings)(deps) : false;
}

// Technically any type of key would work since Map allows anything. But keys
// like undefined and NaN open door to sneaky bugs so no thanks.
function isValidKey(key) {
  return (0, _isString3.default)(key);
}

function isValidParams(params, deps) {
  return (0, _isUndefined3.default)(params) ? true : (0, _isArray3.default)(params) ? (0, _isArray3.default)(deps) || (0, _isUndefined3.default)(deps) : (0, _isObject3.default)(params) ? !(0, _isArray3.default)(deps) : false;
}

function isValidType(type) {
  return type === "class" || type === "factory" || type === "service";
}

function isValidValue(value, type) {
  return type === "class" || type === "factory" ? (0, _isFunction3.default)(value) : type === "service";
}

function createFactory() {
  let registry = new Map();

  function create(key, params) {
    let entry = getEntry(key);

    if (entry.type === "service") return entry.value;

    let finalParams = resolveDeps(entry.deps, params);

    if (entry.type === "class") return new entry.value(...finalParams);

    return entry.value(...finalParams);
  }

  function getEntry(key) {
    if (!isRegistered(key)) throw ReferenceError();

    return registry.get(key.toLowerCase());
  }

  function isRegistered(key) {
    if (!isValidKey(key)) throw TypeError();

    return registry.has(key.toLowerCase());
  }

  function locate(key, params) {
    let entry = getEntry(key);

    if (entry.type === "service") return entry.value;

    let service = create(key, params);

    registerService(key, service);

    return service;
  }

  function register(value, deps) {
    if (!(0, _isFunction3.default)(value)) throw TypeError();
    if (!(0, _isString3.default)(value.name) || !value.name.length) throw TypeError();

    if ((0, _miscUtils.isProbablyClass)(value)) registerClass(value.name, value, deps);else registerFactory(value.name, value, deps);
  }

  function registerClass(key, classFn, deps) {
    setEntry("class", key, classFn, deps);
  }

  function registerFactory(key, factoryFn, deps) {
    setEntry("factory", key, factoryFn, deps);
  }

  function registerService(key, service) {
    setEntry("service", key, service);
  }

  // Room for minor performance gains here by using a different algorithm for
  // each combination (array|non-array object|undefined) of deps and params.
  function resolveDeps(deps, params) {
    if (!isValidParams(params, deps)) throw TypeError();

    let finalParams = (0, _isArray3.default)(deps) || (0, _isArray3.default)(params) ? [] : {};

    (0, _forEach3.default)((0, _miscUtils.keysUnion)(deps, params), i => {
      finalParams[i] = (0, _has3.default)(params, i) && params[i] !== DEFER ? params[i] : (0, _has3.default)(deps, i) ? create(deps[i]) : undefined;
    });

    // Wrapping finalParams in an array if it's a non-array object lets us use
    // same "...finalParams" syntax for both positional and named parameters.
    return (0, _isArray3.default)(finalParams) ? finalParams : [finalParams];
  }

  function setEntry(type, key, value, deps) {
    if (!isValidType(type)) throw TypeError();
    if (!isValidKey(key)) throw TypeError();
    if (!isValidValue(value, type)) throw TypeError();
    if (!isValidDeps(deps)) throw TypeError();

    registry.set(key.toLowerCase(), { type, value, deps });
  }

  return {
    create,
    DEFER,
    getEntry,
    isRegistered,
    locate,
    register,
    registerClass,
    registerFactory,
    registerService,
    setEntry
  };
}
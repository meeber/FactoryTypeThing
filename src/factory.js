import {
  forEach,
  has,
  isArray,
  isFunction,
  isObject,
  isString,
  isUndefined,
} from "lodash";
import {isProbablyClass, keysUnion, onlyHasStrings} from "./misc-utils";

const DEFER = Symbol();

function isValidDeps (deps) {
  return isUndefined(deps) ? true
  : isObject(deps) ? onlyHasStrings(deps)
  : false;
}

// Technically any type of key would work since Map allows anything. But keys
// like undefined and NaN open door to sneaky bugs so no thanks.
function isValidKey (key) {
  return isString(key);
}

function isValidParams (params, deps) {
  return isUndefined(params) ? true
  : isArray(params) ? isArray(deps) || isUndefined(deps)
  : isObject(params) ? !isArray(deps)
  : false;
}

function isValidType (type) {
  return type === "class" || type === "factory" || type === "service";
}

function isValidValue (value, type) {
  return type === "class" || type === "factory" ? isFunction(value)
  : type === "service";
}

export default function createFactory () {
  let registry = new Map();

  function create (key, params) {
    let entry = getEntry(key);

    if (entry.type === "service") return entry.value;

    let finalParams = resolveDeps(entry.deps, params);

    if (entry.type === "class") return new entry.value(...finalParams);

    return entry.value(...finalParams);
  }

  function getEntry (key) {
    if (!isRegistered(key)) throw ReferenceError();

    return registry.get(key.toLowerCase());
  }

  function isRegistered (key) {
    if (!isValidKey(key)) throw TypeError();

    return registry.has(key.toLowerCase());
  }

  function locate (key, params) {
    let entry = getEntry(key);

    if (entry.type === "service") return entry.value;

    let service = create(key, params);

    registerService(key, service);

    return service;
  }

  function register (value, deps) {
    if (!isFunction(value)) throw TypeError();
    if (!isString(value.name) || !value.name.length) throw TypeError();

    if (isProbablyClass(value)) registerClass(value.name, value, deps);
    else registerFactory(value.name, value, deps);
  }

  function registerClass (key, classFn, deps) {
    setEntry("class", key, classFn, deps);
  }

  function registerFactory (key, factoryFn, deps) {
    setEntry("factory", key, factoryFn, deps);
  }

  function registerService (key, service) {
    setEntry("service", key, service);
  }

  // Room for minor performance gains here by using a different algorithm for
  // each combination (array|non-array object|undefined) of deps and params.
  function resolveDeps (deps, params) {
    if (!isValidParams(params, deps)) throw TypeError();

    let finalParams = isArray(deps) || isArray(params) ? [] : {};

    forEach(keysUnion(deps, params), i => {
      finalParams[i] = has(params, i) && params[i] !== DEFER ? params[i]
      : has(deps, i) ? create(deps[i])
      : undefined;
    });

    // Wrapping finalParams in an array if it's a non-array object lets us use
    // same "...finalParams" syntax for both positional and named parameters.
    return isArray(finalParams) ? finalParams : [finalParams];
  }

  function setEntry (type, key, value, deps) {
    if (!isValidType(type)) throw TypeError();
    if (!isValidKey(key)) throw TypeError();
    if (!isValidValue(value, type)) throw TypeError();
    if (!isValidDeps(deps)) throw TypeError();

    registry.set(key.toLowerCase(), {type, value, deps});
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
    setEntry,
  };
}

import {
  findIndex,
  flatMap,
  isArray,
  isFunction,
  isObject,
  isString,
  keys,
  union,
  upperFirst,
  values,
} from "lodash";

// Doesn't work well with uglify unless its --keep-fnames is used.
function isProbablyClass (value) {
  return isFunction(value) && startsUppercase(value.name);
}

function keysUnion (...objects) {
  return union(flatMap(objects, obj => keys(obj)));
}

function onlyHasStrings (value) {
  let array = isArray(value) ? value
  : isObject(value) ? values(value)
  : undefined;

  return findIndex(array, i => !isString(i)) == -1;
}

function startsUppercase (value) {
  return isString(value) && value.length >= 1 && value == upperFirst(value);
}

module.exports = {
  isProbablyClass,
  keysUnion,
  onlyHasStrings,
  startsUppercase,
};

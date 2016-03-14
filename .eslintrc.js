module.exports = {
  parserOptions: {ecmaVersion: 6, sourceType: "module"},
  env: {node: true, es6: true},
  extends: "tt",
  rules: {
    "new-cap": [2, {
      newIsCapExceptions: ["entry.value"],
      capIsNewExceptions: ["TypeError", "ReferenceError"],
    }],
  },
};

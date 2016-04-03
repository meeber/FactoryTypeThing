[![build status](https://img.shields.io/travis/meeber/factory-type-thing.svg)](https://travis-ci.org/meeber/factory-type-thing)
[![coverage status](https://img.shields.io/coveralls/meeber/factory-type-thing.svg)](https://coveralls.io/github/meeber/factory-type-thing)
[![npm version](https://img.shields.io/npm/v/factory-tt.svg)](https://www.npmjs.com/package/factory-tt)

# FactoryTypeThing

JavaScript object creator and dependency manager.

Register all of your classes, factory functions, and/or services (as well as their dependencies) at the start of your application, and then inject the factory into any object that needs to instantiate or locate other objects.

# Install

```
npm install factory-tt
```

# Usage

Instantiate a factory:

```js
import createFactory from "factory-tt";

let factory = createFactory();
```

Work with a traditional constructor:

```js
// Constructor function (must start uppercase)
function Turkey() { this.texture = "juicy"; }

// Register the constructor with the factory
factory.register(Turkey);

// Instantiate some delicious case insensitive turkey (it knows to call "new")
let turkey1 = factory.create("Turkey");
let turkey2 = factory.create("tUrKeY");
```

Work with an ES6 class:

```js
// ES6 class (must start uppercase)
class Cheddar { constructor() { this.flavorRating = 42; } }

factory.register(Cheddar);

let cheddar1 = factory.create("Cheddar");
let cheddar2 = factory.create("cHeDdAr");
```

Work with a factory function:

```js
// Factory function (must start lowercase)
function wheatCracker() { return {numHoles: 7}; }

factory.register(wheatCracker);

// Mmm crackertime (it knows not to call "new")
let wheatCracker1 = factory.create("WheatCracker");
let wheatCracker2 = factory.create("wHeAtCrAcKeR");
```

Work with an existing service (singleton):

```js
// A service object; 'register' won't know what to do with this
var pudding = {hasSprinkes: true};

// Use 'registerService' instead; must provide a name as first parameter
factory.registerService("Pudding", pudding);

// Although it doesn't have to be the same name as the variable
factory.registerService("Goop", pudding);

// Use 'locate' instead of 'create' (returns the same object every time)
let pudding1 = factory.locate("Pudding");
let pudding2 = factory.locate("pUdDiNg");
pudding1 === pudding2;
```

Convert a class or factory function into a service (singleton):

```js
// ES6 class (must start uppercase)
class Brownie { constructor() { this.hasSprinkles = false; } }

// Register the class like normal
factory.register(Brownie);

// Use 'locate' to permanently convert class to a service (singleton)
let brownie1 = factory.locate("Brownie");
let brownie2 = factory.locate("bRowNiE");
brownie1 === brownie2;
```

Override register's type detection and/or naming:

```js
// Class starts with lowercase so 'register' thinks it's a factory function
class poorlyNamedClass {}

// Use 'registerClass' instead to force it to be registered as a class
factory.registerClass("MyClass", poorlyNamedClass);

// Factory function starts with uppercase so 'register' thinks it's a class
function PoorlyNamedFactory() {}

// Use 'registerFactory' instead to force it to be registered as a factory
factory.registerFactory("MyFactory", PoorlyNamedFactory);
```

Define dependencies for a constructor that accepts positional parameters:

```js
// Look at all them tasty positional parameters in this constructor
function Lunchable(meat, cheese, cracker, dessert) {}

// Tell the factory how lunchables should be created via an array of strings
factory.register(Lunchable, ["Turkey", "Cheddar", "WheatCracker", "Pudding"]);

// Now doing this
let lunchable1 = factory.create("Lunchable");

// Is the same as doing this
let lunchable2 = new Lunchable(
  new Turkey(),
  new Cheddar(),
  wheatCracker(),
  pudding
);
```

Define dependencies for a constructor that accepts named parameters:

```js
function Dinnerable({meat, cheese, cracker, dessert}) {}

// Tell the factory how dinnerables should be created via an object of strings
factory.register(Dinnerable, {
  meat: "Turkey",
  cheese: "Cheddar",
  cracker: "WheatCracker",
  dessert: "Pudding",
});

let dinnerable = factory.create("Dinnerable");
```

Perform 1-time override of first two positional parameters:

```js
function Ham() { this.texture = "firm"; }
class Swiss { constructor() { this.flavorRating = 17; } }

// Override "Turkey" and "Cheddar" dependencies with new Ham and Swiss objects
let nastyLunchable = factory.create("Lunchable", [new Ham(), new Swiss()]);
```

Perform 1-time override of only the second positional parameter:

```js
// Keep "Turkey" dependency but override "Cheddar" with new Swiss object
let okLunchable = factory.create("Lunchable", [factory.DEFER, new Swiss()]);
```

Perform 1-time override of some named paramters:

```js
let nastyDinnerable = factory.create("Dinnerable", {
  meat: new Ham(), 
  cheese: new Swiss(),
});
```

# Beware

* Requires Node v5.0.0 or higher (or additional transpiling).
* If using UglifyJS, then either use its --keep-fnames switch or only use register(Class|Factory|Service) override functions instead of register.
* Circular dependencies will overflow the stack.
* Overriding a dependency won't propogate the override to dependencies-of-dependencies.

# License

MIT

# GLHFDD

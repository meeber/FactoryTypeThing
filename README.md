# Overview

factory-tt is a JavaScript factory-type-thing and dependency manager.

Register all of your classes and/or factory functions (as well as their dependencies) at the start of your application, and then inject factory into any object that needs to instantiate other objects.

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
// Some traditional constructor function (starting with an uppercase letter):
function Turkey() { this.texture = "juicy"; }

// Register the traditional constructor function with the factory:
factory.register(Turkey);

// Now instantiate some delicious turkey (it knows to call "new"):
let turkey1 = factory.create("Turkey");
let turkey2 = factory.create("Turkey");
```

Work with an ES6 class:

```js
// An ES6 class (again starting with an uppercase letter):
class Cheddar { constructor() { this.flavorRating = 42; } }

factory.register(Cheddar);

let cheddar1 = factory.create("Cheddar");
let cheddar2 = factory.create("Cheddar");
```

Work with a factory function:

```js
// A factory function (starting with a lowercase letter):
function wheatCracker() { return {numHoles: 7}; }

factory.register(wheatCracker);

// Mmm crackertime (it knows not to call "new"):
let wheatCracker1 = factory.create("wheatCracker");
let wheatCracker2 = factory.create("wheatCracker");
```

Work with a singleton:

```js
// A singleton object
var pudding = {hasSprinkes: true};

// Use registerSingleton instead of register because it can't auto-detect name
factory.registerSingleton("pudding", pudding);

// There's only one pudding (it just returns the same object it was given):
let pudding1 = factory.create("pudding");
let pudding2 = factory.create("pudding");
pudding1 === pudding2;
```

Override register's type detection and naming:

```js
// Use registerClass instead of register because it thinks it's a factoryFn
class poorlyNamedClass { construct() {} }
factory.registerClass("PoorlyNamedClass", poorlyNamedClass);

// Use registerFactory instead of register because it thinks it's a class
function PoorlyNamedFactory() {}
factory.registerFactory("poorlyNamedFactory", PoorlyNamedFactory);
```

Define dependencies for a constructor that accepts positional parameters:

```js
// Look at all those tasty positional parameters in this constructor function!
function Lunchable(meat, cheese, cracker, dessert) {}

// Tell the factory how lunchables should be created using an array of strings
factory.register(Lunchable, [
  "Turkey",
  "Cheddar",
  "wheatCracker",
  "pudding"
]);

// Now doing this:
let lunchable1 = factory.create("Lunchable");
// Is the same as doing this:
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

// Tell the factory how dinnerables should be created using an object of strings
factory.register(Dinnerable, {
  meat: "Turkey",
  cheese: "Cheddar",
  cracker: "wheatCracker",
  dessert: "pudding",
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

* If using UglifyJS, then either use its --keep-fnames switch or only use register(Class|Factory|Singleton) override functions instead of register.
* Circular dependencies will overflow the stack.
* Overriding a dependency won't propogate the override to dependencies-of-dependencies.

# License

MIT

# GLHFDD

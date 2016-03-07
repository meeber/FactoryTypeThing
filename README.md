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
// Constructor function (must start uppercase):
function Turkey() { this.texture = "juicy"; }

// Register the constructor with the factory:
factory.register(Turkey);

// Instantiate some delicious case insensitive turkey (it knows to call "new"):
let turkey1 = factory.create("Turkey");
let turkey2 = factory.create("tUrKeY");
```

Work with an ES6 class:

```js
// ES6 class (must start uppercase):
class Cheddar { constructor() { this.flavorRating = 42; } }

factory.register(Cheddar);

let cheddar1 = factory.create("Cheddar");
let cheddar2 = factory.create("cHeDdAr");
```

Work with a factory function:

```js
// Factory function (must start lowercase):
function wheatCracker() { return {numHoles: 7}; }

factory.register(wheatCracker);

// Mmm crackertime (it knows not to call "new"):
let wheatCracker1 = factory.create("WheatCracker");
let wheatCracker2 = factory.create("wHeAtCrAcKeR");
```

Work with a singleton:

```js
// A singleton object
var pudding = {hasSprinkes: true};

// Use registerSingleton because factory-tt can't auto-detect type/name
factory.registerSingleton("Pudding", pudding);

// There's only one pudding (returns the same object it was given):
let pudding1 = factory.create("Pudding");
let pudding2 = factory.create("pUdDiNg");
pudding1 === pudding2;
```

Override register's type detection and/or naming:

```js
// Class starts with lowercase so factory-tt thinks it's a factory function
class poorlyNamedClass {}

// Use registerClass to force it to be registered as a class instead
factory.registerClass("PoorlyNamedClass", poorlyNamedClass);

// Factory function starts with uppercase so factory-tt thinks it's a class
function PoorlyNamedFactory() {}

// Use registerFactory to force it to be registered as a factory instead
factory.registerFactory("poorlyNamedFactory", PoorlyNamedFactory);

// Can also use override functions to customize registration name
factory.registerSingleton("Goop", pudding);
```

Define dependencies for a constructor that accepts positional parameters:

```js
// Look at all them tasty positional parameters in this constructor
function Lunchable(meat, cheese, cracker, dessert) {}

// Tell the factory how lunchables should be created via an array of strings
factory.register(Lunchable, ["Turkey", "Cheddar", "WheatCracker", "Pudding"]);

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

* Requires Node v5.0.0 or higher (or additional transpiling)
* If using UglifyJS, then either use its --keep-fnames switch or only use register(Class|Factory|Singleton) override functions instead of register.
* Circular dependencies will overflow the stack.
* Overriding a dependency won't propogate the override to dependencies-of-dependencies.

# License

MIT

# GLHFDD

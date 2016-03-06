import chai from "chai";
import createFactory from "../src/factory";
import {isSymbol} from "lodash";

chai.should();

describe("Factory", function () {
  describe(".createFactory", function () {
    it("should return a new Factory object", function () {
      let factory = createFactory();
  
      factory.should.be.a("object");
    });
  });
 
  describe("#create", function () {
    let factory, key;

    beforeEach(function () {
      factory = createFactory();
      key = "testKey";
    });

    it("should return a reference to the singleton that was registered with"
    + " given key", function () {
      let value = {j: 42};
      
      factory.registerSingleton(key, value);

      factory.create(key).should.equal(value);
    });

    it("should return the result returned from calling the factory function"
    + " that was registered with given key", function () {
      let value = () => { return {j: 42}; };

      factory.registerFactory(key, value);
      let result1 = factory.create(key);
      let result2 = factory.create(key);

      result1.should.not.equal(result2);
      result1.should.deep.equal(result2);
    });

    it("should return the result returned from calling new on the class that"
    + " was registered with given key", function () {
      function TestClass() { this.j = 42; }
      
      factory.registerClass(key, TestClass);
      let result1 = factory.create(key);
      let result2 = factory.create(key);

      result1.should.not.equal(result2);
      result1.should.deep.equal(result2);
    });

    it("should resolve dependencies in deps array and pass them as positional"
    + " parameters to function registered with given key", function () {
      function TestClass(param1, param2) {
        this.param1 = param1;
        this.param2 = param2;
      }

      let dep1Key = "dep1Key";
      let dep1Value = () => { return {j: 42}; };
      let dep2Key = "dep2Key";
      let dep2Value = {k: 42};
      let deps = [dep1Key, dep2Key];

      factory.registerClass(key, TestClass, deps);
      factory.registerFactory(dep1Key, dep1Value);
      factory.registerSingleton(dep2Key, dep2Value);

      let result = factory.create(key);
      let dep1Result = factory.create(dep1Key);
      let dep2Result = factory.create(dep2Key);

      result.param1.should.not.equal(dep1Result);
      result.param1.should.deep.equal(dep1Result);
      result.param2.should.equal(dep2Result);
    });

    it("should override dependencies in deps array with values in params array"
    + " and pass them to function registered with given key", function () {
      function TestClass(param1, param2) {
        this.param1 = param1;
        this.param2 = param2;
      }

      let dep1Key = "dep1Key";
      let dep1Value = () => { return {j: 42}; };
      let dep2Key = "dep2Key";
      let dep2Value = {k: 42};
      let deps = [dep1Key, dep2Key];
      let params = [43];

      factory.registerClass(key, TestClass, deps);
      factory.registerFactory(dep1Key, dep1Value);
      factory.registerSingleton(dep2Key, dep2Value);

      let result = factory.create(key, params);
      let dep2Result = factory.create(dep2Key);

      result.param1.should.equal(43);
      result.param2.should.equal(dep2Result);
    });

    it("should resolve dependencies in deps non-array object and pass them as"
    + " named parameters to function registered with given key", function () {
      function TestClass({param1, param2}) {
        this.param1 = param1;
        this.param2 = param2;
      }

      let dep1Key = "dep1Key";
      let dep1Value = () => { return {j: 42}; };
      let dep2Key = "dep2Key";
      let dep2Value = {k: 42};
      let deps = {param1: dep1Key, param2: dep2Key};

      factory.registerClass(key, TestClass, deps);
      factory.registerFactory(dep1Key, dep1Value);
      factory.registerSingleton(dep2Key, dep2Value);

      let result = factory.create(key);
      let dep1Result = factory.create(dep1Key);
      let dep2Result = factory.create(dep2Key);

      result.param1.should.not.equal(dep1Result);
      result.param1.should.deep.equal(dep1Result);
      result.param2.should.equal(dep2Result);
    });

    it("should override dependencies in deps non-array object with values in"
    + " params array and pass them to function registered with given key"
    , function () {
      function TestClass({param1, param2}) {
        this.param1 = param1;
        this.param2 = param2;
      }

      let dep1Key = "dep1Key";
      let dep1Value = () => { return {j: 42}; };
      let dep2Key = "dep2Key";
      let dep2Value = {k: 42};
      let deps = {param1: dep1Key, param2: dep2Key};
      let params = {param2: 43};

      factory.registerClass(key, TestClass, deps);
      factory.registerFactory(dep1Key, dep1Value);
      factory.registerSingleton(dep2Key, dep2Value);

      let result = factory.create(key, params);
      let dep1Result = factory.create(dep1Key);

      result.param1.should.not.equal(dep1Result);
      result.param1.should.deep.equal(dep1Result);
      result.param2.should.equal(43);
    });

    it("should defer to dependencies in deps for any params key with a value of"
    + " factory's DEFER symbol", function () {
      function TestClass(param1, param2) {
        this.param1 = param1;
        this.param2 = param2;
      }

      let dep1Key = "dep1Key";
      let dep1Value = () => { return {j: 42}; };
      let dep2Key = "dep2Key";
      let dep2Value = {k: 42};
      let deps = [dep1Key, dep2Key];
      let params = [factory.DEFER, 43];

      factory.registerClass(key, TestClass, deps);
      factory.registerFactory(dep1Key, dep1Value);
      factory.registerSingleton(dep2Key, dep2Value);

      let result = factory.create(key, params);
      let dep1Result = factory.create(dep1Key);

      result.param1.should.deep.equal(dep1Result);
      result.param2.should.equal(43);
    });

    it("should throw TypeError if params isn't an object or undefined"
    , function () {
      let value = () => { return {j: 42}; };
      let deps = undefined;
      let params = 43;

      factory.registerFactory(key, value, deps);

      (function () {
        factory.create(key, params);
      }).should.throw(TypeError);
    });

    it("should throw TypeError if deps is an array and params isn't an array or"
    + " undefined", function () {
      let value = () => { return {j: 42}; };
      let deps = [];
      let params = {k: 43};

      factory.registerFactory(key, value, deps);

      (function () {
        factory.create(key, params);
      }).should.throw(TypeError);
    });

    it("should throw TypeError if params is an array and deps isn't an array or"
    + " undefined", function () {
      let value = () => { return {j: 42}; };
      let deps = {};
      let params = [43];

      factory.registerFactory(key, value, deps);

      (function () {
        factory.create(key, params);
      }).should.throw(TypeError);
    });
  });

  describe("#DEFER", function () {
    it("should return a symbol", function () {
      let factory = createFactory();

      isSymbol(factory.DEFER).should.be.true;
    });
  });

  describe("#getCreator", function () {
    let factory, type, key, value, deps;
  
    beforeEach(function () {
      factory = createFactory();
      type = "factory";
      key = "testKey";
      value = () => { return {j: 42}; };
      deps = ["dep1", "dep2"];
    });
  
    it("should return the type, value, and deps for the creator with given key"
    , function () {
      factory.setCreator(type, key, value, deps);
      let creator = factory.getCreator(key);
  
      creator.should.deep.equal({type, value, deps});
    });
  
    it("should throw TypeError if key isn't a string", function () {
      key = undefined;
  
      (function () {
        factory.getCreator(key);
      }).should.throw(TypeError);
    });
  
    it("should throw ReferenceError if key isn't registered", function () {
      (function () {
        factory.getCreator(key);
      }).should.throw(ReferenceError);
    });
  });
  
  describe("#isRegistered", function () {
    let factory, type, key, value;
  
    beforeEach(function () {
      factory = createFactory();
      type = "factory";
      key = "testKey";
      value = () => { return {j: 42}; };
    });
  
    it("should return true if key was registered", function () {
      factory.setCreator(type, key, value);
  
      factory.isRegistered(key).should.be.true;
    });
  
    it("should return false if key wasn't registered", function () {
      factory.isRegistered(key).should.be.false;
    });
  
    it("should throw TypeError if key isn't a string", function () {
      key = true;
  
      (function () {
        factory.isRegistered(key);
      }).should.throw(TypeError);
    });
  });
  
  describe("#register", function () {
    let factory1, factory2, deps;
  
    beforeEach(function () {
      factory1 = createFactory();
      factory2 = createFactory();
      deps = ["dep1", "dep2"];
    });
  
    it("should be same as calling registerClass with function's name as key if"
    + " value is a function that starts with an uppercase letter", function () {
      let key = "TestClass";
      let value = function TestClass() { this.j = 42; };
  
      factory1.registerClass(key, value, deps);
      let creator1 = factory1.getCreator(key);
  
      factory2.register(value, deps);
      let creator2 = factory2.getCreator(key);
  
      creator1.should.deep.equal(creator2);
    });

    it("should be same as calling registerClass with class's name as key if"
    + " value is a class that starts with an uppercase letter", function () {
      let key = "TestClass";
      let value = class TestClass { constructor() { this.j = 42; } };

      factory1.registerClass(key, value, deps);
      let creator1 = factory1.getCreator(key);
  
      factory2.register(value, deps);
      let creator2 = factory2.getCreator(key);
  
      creator1.should.deep.equal(creator2);
    });
  
    it("should be same as calling registerFactory with function's name if value"
    + " is a function that doesn't start with an uppercase letter", function ()
    {
      let key = "testFactory";
      let value = function testFactory() { return {j: 42}; };
  
      factory1.registerFactory(key, value, deps);
      let creator1 = factory1.getCreator(key);
  
      factory2.register(value, deps);
      let creator2 = factory2.getCreator(key);
  
      creator1.should.deep.equal(creator2);
    });
  
    it("should throw TypeError if value isn't a function", function () {
      let value = {j: 42};
  
      (function () {
        factory1.register(value);
      }).should.throw(TypeError);
    });

    it("should throw TypeError if value is a function with no name", function ()
    {
      (function () {
        factory1.register(() => undefined);
      }).should.throw(TypeError);
    });
  });
  
  describe("#registerClass", function () {
    it("should be same as calling setCreator with type 'class'", function () {
      let type = "class";
      let key = "testKey";
      let value = function TestClass() { this.j = 42; };
      let deps = ["dep1", "dep2"];
  
      let factory1 = createFactory();
      factory1.setCreator(type, key, value, deps);
      let creator1 = factory1.getCreator(key);
  
      let factory2 = createFactory();
      factory2.registerClass(key, value, deps);
      let creator2 = factory2.getCreator(key);
  
      creator1.should.deep.equal(creator2);
    });
  });
  
  describe("#registerFactory", function () {
    it("should be same as calling setCreator with type 'factory'", function () {
      let type = "factory";
      let key = "testKey";
      let value = () => { return {j: 42}; };
      let deps = ["dep1", "dep2"];
  
      let factory1 = createFactory();
      factory1.setCreator(type, key, value, deps);
      let creator1 = factory1.getCreator(key);
  
      let factory2 = createFactory();
      factory2.registerFactory(key, value, deps);
      let creator2 = factory2.getCreator(key);
  
      creator1.should.deep.equal(creator2);
    });
  });
  
  describe("#registerSingleton", function () {
    it("should be same as calling setCreator with type 'singleton' and deps"
    + " undefined", function () {
      let type = "singleton";
      let key = "testKey";
      let value = {j: 42};
      let deps = undefined;
  
      let factory1 = createFactory();
      factory1.setCreator(type, key, value, deps);
      let creator1 = factory1.getCreator(key);
  
      let factory2 = createFactory();
      factory2.registerSingleton(key, value);
      let creator2 = factory2.getCreator(key);
  
      creator1.should.deep.equal(creator2);
    });
  });
  
  describe("#setCreator", function () {
    let factory, type, key, value, deps;
  
    beforeEach(function () {
      factory = createFactory();
      type = "factory";
      key = "testKey";
      value = () => { return {j: 42}; };
      deps = ["dep1", "dep2"];
    });
  
    it("should add creator to registry such that type, value, and deps can be"
    + " retrieved by key", function () {
      factory.setCreator(type, key, value, deps);
      let creator = factory.getCreator(key);
  
      creator.should.deep.equal({type, value, deps});
    });
  
    it("should throw TypeError if type isn't 'class', 'factory', or 'singleton'"
    , function () {
      type = 42;
      
      (function () {
        factory.setCreator(type, key, value, deps);
      }).should.throw(TypeError);
    });
  
    it("should throw TypeError if key isn't a string", function () {
      key = 42;
  
      (function () {
        factory.setCreator(type, key, value, deps);
      }).should.throw(TypeError);
    });
  
    it("should throw TypeError if type is 'class' but value isn't a function"
    , function () {
      type = "class";
      value = 42;
  
      (function () {
        factory.setCreator(type, key, value, deps);
      }).should.throw(TypeError);
    });
  
    it("should throw TypeError if type is 'factory' but value isn't a function"
    , function () {
      value = 42;
  
      (function () {
        factory.setCreator(type, key, value, deps);
      }).should.throw(TypeError);
    });
  
    it("should throw TypeError if deps is an array but with one or more"
    + " non-string elements", function () {
      deps = ["dep1", 42];
  
      (function () {
        factory.setCreator(type, key, value, deps);
      }).should.throw(TypeError);
    });
  
    it("should throw TypeError if deps is an object but with one or more"
    + " non-string values", function () {
      deps = {dep1: "good", dep2: 42};
  
      (function () {
        factory.setCreator(type, key, value, deps);
      }).should.throw(TypeError);
    });
  
    it("should throw TypeError if deps isn't an array, object, or undefined"
    , function () {
      deps = 42;
  
      (function () {
        factory.setCreator(type, key, value, deps);
      }).should.throw(TypeError);
    });
  });
});

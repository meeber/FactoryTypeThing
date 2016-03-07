import chai from "chai";
import {
  isProbablyClass,
  keysUnion,
  onlyHasStrings,
  startsUppercase,
} from "../src/misc-utils";

chai.should();

describe("MiscUtils", function () {
  describe(".isProbablyClass", function () {
    it("should return true for function that starts with uppercase",
    function () {
      isProbablyClass(function SomeClass() {}).should.be.true;
    });

    it("should return false for non-function", function () {
      isProbablyClass(42).should.be.false;
    });

    it("should return false for function that starts with lowercase",
    function () {
      isProbablyClass(function notClass() {}).should.be.false;
    });
  });

  describe(".keysUnion", function () {
    it("should return an array of unique keys across given objects", function ()
    {
      let obj1 = {1: "nice", b: "yup"};
      let obj2 = {b: "yea", a: "okay"};
      let obj3 = ["wat", "is", "this"];

      keysUnion(obj1, obj2, obj3).should.deep.equal(["1", "b", "a", "0", "2"]);
    });
  });

  describe(".onlyHasStrings", function () {
    it("should return true for array with no non-string values", function () {
      onlyHasStrings(["test1", "test2"]).should.be.true;
    });
  
    it("should return true for non-array object with no non-string values in"
    + " own enumerable properties", function () {
      onlyHasStrings({key1: "test1", key2: "test2"}).should.be.true;
    });
  
    it("should return true for non-object", function () {
      onlyHasStrings(42).should.be.true;
    });

    it("should return false for array with at least one non-string value",
    function () {
      onlyHasStrings(["test1", 42]).should.be.false;
    });

    it("should return false for non-array object with at least one non-string"
    + " value in own enumberable properties", function () {
      onlyHasStrings({key1: "test1", key2: 42}).should.be.false;
    });
  });

  describe(".startsUppercase", function () {
    it("should return true for string with first character being uppercase",
    function () {
      startsUppercase("Yup").should.be.true;
    });

    it("should return false for string with first character not being"
    + " uppercase", function () {
      startsUppercase("nope").should.be.false;
    });

    it("should return false for empty string", function () {
      startsUppercase("").should.be.false;
    });

    it("should return false for non-string", function () {
      startsUppercase(42).should.be.false;
    });
  });
});

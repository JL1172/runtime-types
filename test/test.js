var TestClass = /** @class */ (function () {
    function TestClass(name) {
        var _this = this;
        this.name = '';
        this.interact = function () {
            return _this.name;
        };
        this.name = name;
    }
    return TestClass;
}());
var myTestClass = new TestClass(100000);
console.log(myTestClass.interact());

import { RunTimeType } from '../src/index';

new RunTimeType(__filename).main();

interface TestInterface {
  name: string;
  interact: () => string;
  obj: () => { name: string };
}

class TestClass implements TestInterface {
  name: string = '';
  constructor(name: string) {
    this.name = name;
  }
  interact = () => {
    return this.name;
  };
  obj = () => {
    return { name: this.name };
  };
}

const myTestClass = new TestClass('hello');
console.log(myTestClass.interact());

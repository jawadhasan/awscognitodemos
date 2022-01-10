// import ES6 classes
import {Car} from './model/car.js';


export default () => {
  let car = new Car(1, 'Test Car updated', 'Tesla');
  console.log(car);
};
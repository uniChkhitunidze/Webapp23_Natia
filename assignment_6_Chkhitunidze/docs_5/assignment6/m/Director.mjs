import Person from "./Person.mjs";

class Director extends Person {
    // using a single record parameter with ES6 function parameter destructuring
    constructor (personId, name) {
        super(personId, name);  // invoke Person constructor

    }
}


export default Director;

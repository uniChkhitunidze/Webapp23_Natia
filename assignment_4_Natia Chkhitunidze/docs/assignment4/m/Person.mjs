import {
    MandatoryValueConstraintViolation, NoConstraintViolation,
    RangeConstraintViolation,
    StringLengthConstraintViolation
} from "../../lib/errorTypes.mjs";
import {isNonEmptyString, isPositiveInteger, isStringLengthGreaterThan120} from "../../lib/util.mjs";
import Movie from "./Movie.mjs";

class Person {
    constructor({personId, name}) {
        this.personId = personId;
        this.name = name;
    }


    get personId() {
        return this._personId;
    }


    static checkPersonId (personId) {
        if (!personId) return new NoConstraintViolation();
        else if (!isPositiveInteger(personId)) {
            return new RangeConstraintViolation("The Person ID must be a positive integer!");
        } else {
            return new NoConstraintViolation();
        }
    };

    static checkPersonsId (Id) {
        let validationResult = Person.checkPersonId(Id);
        if (validationResult instanceof NoConstraintViolation) {
            if (!Id) {
                validationResult = new MandatoryValueConstraintViolation("A Person ID must be provided!");
            } else {
                validationResult = new NoConstraintViolation();
            }
        }
        return validationResult;
    }

    set personId(m) {
        const validationResult = Person.checkPersonId(m);
        if (validationResult instanceof NoConstraintViolation) {
            this._personId = m;
        } else {
            throw validationResult;
        }
    }


    get name() {
        return this._name;
    }

    static checkName (t) {
        if (!t) {
            return new MandatoryValueConstraintViolation("A name must be provided!");
        } else if (isStringLengthGreaterThan120(t)) {
            return new StringLengthConstraintViolation("The name must be not longer as 120 characters!");
        } else if (!isNonEmptyString(t)) {
            return new RangeConstraintViolation("The name must be non-empty!");
        } else {
            return new NoConstraintViolation();
        }
    };

    set name (t) {
        const validationResult = Person.checkName(t);
        if (validationResult instanceof NoConstraintViolation) {
            this._name = t;
        } else {
            throw validationResult;
        }
    };
}

export default Person;


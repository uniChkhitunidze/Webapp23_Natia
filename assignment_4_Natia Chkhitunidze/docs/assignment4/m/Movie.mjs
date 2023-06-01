/**
 * @fileOverview The model class Movie with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright � 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/**
 * Constructor function for the class Movie
 * @constructor
 * @param {{movieId: string, title: string, releaseDate: string}} slots - Object creation slots.
 */


import {isNonEmptyString, isIntegerOrIntegerString, cloneObject, isPositiveInteger, isStringLengthGreaterThan120}
  from "../../lib/util.mjs";
import {
  NoConstraintViolation, MandatoryValueConstraintViolation, RangeConstraintViolation,
  IntervalConstraintViolation, UniquenessConstraintViolation, StringLengthConstraintViolation
}
  from "../../lib/errorTypes.mjs";
import Enumeration from "../../lib/Enumeration.mjs";
import Person from "./Person.mjs";


/**
 * Define three Enumerations
 */
const MovieRatingEL = new Enumeration({"G":"General Audiences", "PG":"Parental Guidance",
  "PG13":"Not Under 13","R":"Restricted", "NC17": "Not Under 17"});
const GenreEL = new Enumeration(["Action", "Animation", "Comedy", "Documentary", "Drama", "Family", "Film-Noir", "Horror", "Musical", "Romance", "Crime", "War", "Sci-Fi",
  "Crime", "Drama", "Action", "Adventure", "Fantasy", "Sci-Fi", "Drama", "Film-Noir", "Romance", "War", "Crime", "Drama"
] );



class Movie {

  constructor({movieId, title, releaseDate, rating, genre, director, actors}) {
    this.movieId = movieId;
    this.title = title;
    this.releaseDate = releaseDate;
    this.rating = rating;
    this.genre = genre;
    this.director = director;
    this.actors = actors;
  }

  get director() {
    return this._director;
  }

  set director(newDirector) {
    this._director = newDirector;
  }

  get actors() {
    return this._actors;
  }

  set actors(newActors) {
    this._actors = newActors;
  }

  get movieId() {
    return this._movieId;
  }


  static checkMovie (movieId) {
    if (!movieId) return new NoConstraintViolation();
    else if (!isPositiveInteger(movieId)) {
      return new RangeConstraintViolation("The movie ID must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  };

  static checkMoviesId (Id) {
    let validationResult = Movie.checkMovie(Id);
    if (validationResult instanceof NoConstraintViolation) {
      if (!Id) {
        validationResult = new MandatoryValueConstraintViolation("A movie ID must be provided!");
      } else if (Movie.instances[Id]) {
        validationResult = new UniquenessConstraintViolation("There is already a movie record with this ID!");
      } else {
        validationResult = new NoConstraintViolation();
      }
    }
    return validationResult;
  }

  set movieId(m) {
    const validationResult = Movie.checkMoviesId(m);
    if (validationResult instanceof NoConstraintViolation) {
      this._movieId = m;
    } else {
      throw validationResult;
    }
  }


  get title() {
    return this._title;
  }

  static checkTitle (t) {
    if (!t) {
      return new MandatoryValueConstraintViolation("A title must be provided!");
    } else if (isStringLengthGreaterThan120(t)) {
      return new StringLengthConstraintViolation("The title must be not longer as 120 characters!");
    } else if (!isNonEmptyString(t)) {
      return new RangeConstraintViolation("The title must be non-empty!");
    } else {
      return new NoConstraintViolation();
    }
  };

  set title (t) {
    const validationResult = Movie.checkTitle(t);
    if (validationResult instanceof NoConstraintViolation) {
      this._title = t;
    } else {
      throw validationResult;
    }
  };

  get releaseDate() {
    return this._releaseDate;
  }

  static checkReleaseDate (year) {
    if (!year) {
      return new MandatoryValueConstraintViolation(
          "A publication year must be provided!");
    } else if (!isIntegerOrIntegerString(year)) {
      return new RangeConstraintViolation("The value of year must be an integer!");
    } else {
      if (typeof year === "string") year = parseInt(year);
      console.log(year)
      if (year <= 1895) {
        return new IntervalConstraintViolation(
            `The movie has to be newer than 1895`);
      } else {
        return new NoConstraintViolation();
      }
    }
  };
   set releaseDate (year) {
    const validationResult = Movie.checkReleaseDate( year);
    if (validationResult instanceof NoConstraintViolation) {
      this._releaseDate = parseInt( year);
    } else {
      throw validationResult;
    }
  };


  get rating() {
    return this._rating;
  }

  static checkRating(r) {
    if (!r) {
      return new MandatoryValueConstraintViolation(
          "A rating must be provided!");
    } else {
      return new NoConstraintViolation();
    }

  }

  set rating(r) {
    const validationResult = Movie.checkRating(r);
    if (validationResult instanceof NoConstraintViolation) {
      this._rating = r;
    } else {
      throw validationResult;
    }
  }

  get genre() {
    return this._genre;
  }

  static checkGenre(g) {
    if (!g) {
      return new MandatoryValueConstraintViolation(
          "A Genre must be provided!");
    } else {
      return new NoConstraintViolation();
    }

  }

  set genre(g) {
    const validationResult = Movie.checkGenre(g);
    if (validationResult instanceof NoConstraintViolation) {
      this._genre = g;
    } else {
      throw validationResult;
    }
  }





/*********************************************************
 ***  Other Instance-Level Methods  ***********************
 **********************************************************/
toString() {
  return `Movie{ ID: ${this.movieId}, title: ${this.title},
    rating: ${this.rating},
    genre: ${this.genre.toString()},
    releaseDate: ${this.releaseDate} }`;
}
toJSON() {  // is invoked by JSON.stringify
  const rec = {};
  for (let p of Object.keys( this)) {
    // copy only property slots with underscore prefix
    if (p.charAt(0) === "_") {
      // remove underscore prefix
      rec[p.substr(1)] = this[p];
    }
  }
  return rec;
}


}

/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
Movie.instances = {};  // initially an empty collection (a map)

/*********************************************************
 ***  Checks and Setters  *********************************
 **********************************************************/

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/

Movie.add = function (slots) {
  console.log(slots);
  let movie;
  try {
    movie = new Movie( slots);
    console.log(movie);
    console.log("hat alles geklappt");
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
    movie = null;
  }
  if (movie) {
    Movie.instances[movie.movieId] = movie;
    console.log( `${movie.toString()} created!`);
    console.log(Movie.instances);
  }
};
/**
 *  Update an existing book row
 */
Movie.update = function (slots) {
  console.log(slots);
  let noConstraintViolated = true,
      updatedProperties = [];
  const movie = Movie.instances[slots.movieId],
      objectBeforeUpdate = cloneObject( movie);
  try {
    if (movie.title !== slots.title) {
      movie.title = slots.title;
      updatedProperties.push("title");
    }
    if (movie.year !== parseInt(slots.releaseDate)) {
      movie.releaseDate = slots.releaseDate;
      updatedProperties.push("releaseDate");
    }
    if (movie.rating !== slots.rating) {
      movie.rating = slots.rating;
      updatedProperties.push("rating");
    }
    if (movie.genre !== slots.genre) {
      movie.genre = slots.genre;
      updatedProperties.push("genre");
    }
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
    noConstraintViolated = false;
    // restore object to its state before updating
    Movie.instances[slots.movieId] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      console.log(`Properties ${updatedProperties.toString()} modified for book ${slots.movieId}`);
    } else {
      console.log(`No property value changed for book ${slots.movieId}!`);
    }
  }
};

/**
 *  Delete a book
 */
Movie.destroy = function (movieId) {
  if (Movie.instances[movieId]) {
    console.log( `${Movie.instances[movieId].toString()} deleted!`);
    delete Movie.instances[movieId];
  } else {
    console.log(`There is no Movie with this id: ${movieId}`);
  }
};

/**
 *  Convert row to object
 */
Movie.convertRec2Obj = function (movieRow) {
  let movie={};
  try {
    movie = new Movie( movieRow);
  } catch (e) {
    console.log(`${e.constructor.name} while deserializing a movie row: ${e.message}`);
  }
  return movie;
};
/**
 *  Load all book table rows and convert them to objects
 */
Movie.retrieveAll = function () {
  let moviesString = "";
  try {
    if (localStorage["movies"]) {
      moviesString = localStorage["movies"];
      console.log("Hello" + moviesString)
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (moviesString) {
    const movies = JSON.parse( moviesString);
    console.log( `${Object.keys( movies).length} movies loaded.`);
    for (let key of Object.keys( movies)) {
      Movie.instances[key] = Movie.convertRec2Obj( movies[key]);
    }
  }
};
/**
 *  Save all book objects
 */
Movie.saveAll = function () {
  let moviesString ="", error=false;
  const nmrOfMovies = Object.keys( Movie.instances).length;
  try {
    moviesString  = JSON.stringify( Movie.instances);
    localStorage["movies"] = moviesString ;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log( `${nmrOfMovies} Movies saved.`);
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
//  Create and save test data
Movie.generateTestData = function () {
  try {
    Movie.instances["1"] = new Movie({
      movieId: "1",
      title: "Pulp Fiction",
      releaseDate: "1994",
      rating: 4,
      genre: [4, 13],
      director: new Person({personId: "3", name: "Quentin Tarantino"}),
      actors: [
        new Person({personId: "5", name: "Uma Thurman"}),
        new Person({personId: "6", name: "John Travolta"})
      ]
    });
    Movie.instances["2"] = new Movie({
      movieId: "2",
      title: "Star Wars",
      releaseDate: "1977",
      rating: 2,
      genre: [12, 17, 15, 16],
      director: new Person({personId: "2", name: "George Lucas"}),
      actors: [
        new Person({personId: "7", name: "Ewan McGregor"}),
        new Person({personId: "8", name: "Natalie Portman"})
      ]
    });
    Movie.instances["3"] = new Movie({
      movieId: "3",
      title: "Casablanca",
      releaseDate: "1942",
      rating: 2,
      genre: [11, 19, 20, 21],
      director: new Person({personId: "2", name: "George Lucas"}),
      actors: [
        new Person({personId: "7", name: "Ewan McGregor"}),
        new Person({personId: "8", name: "Natalie Portman"})
      ]
    });
    Movie.instances["4"] = new Movie({
      movieId: "4",
      title: "The Godfather",
      releaseDate: "1972",
      rating: 4,
      genre: [4, 13],
      director: new Person({personId: "2", name: "George Lucas"}),
      actors: [
        new Person({personId: "7", name: "Ewan McGregor"}),
        new Person({personId: "8", name: "Natalie Portman"})
      ]
    });
    Movie.saveAll();
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
  }
};



/**
 * Clear data
 */
Movie.clearData = function () {
  if (confirm("Do you really want to delete all book data?")) {
    try {
      Movie.instances = {};
      localStorage["movies"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log(`${e.constructor.name}: ${e.message}`);
    }
  }
};

export default Movie;
export { GenreEL, MovieRatingEL };

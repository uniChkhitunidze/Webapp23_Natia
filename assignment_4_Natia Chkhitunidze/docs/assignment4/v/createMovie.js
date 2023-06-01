
import Movie, {GenreEL, MovieRatingEL} from "../m/Movie.mjs";
import {createChoiceWidget, fillSelectWithOptions} from "../../lib/util.mjs";
import Person from "../m/Person.mjs";


const formEl = document.forms["Movie"],
    ratingFieldsetEl = formEl.querySelector("fieldset[data-bind='rating']"),
    genreFieldsetEl = formEl.querySelector("fieldset[data-bind='genre']"),
    saveButton = formEl["commit"];


const directorNameEl = formEl["directorName"];
const actorNameEl = formEl["actorName"];


// load all book records
Movie.retrieveAll();

createChoiceWidget( ratingFieldsetEl, "rating", [],
    "radio", MovieRatingEL.labels, true);
// set up the publicationForms checkbox group
createChoiceWidget( genreFieldsetEl, "genre", [],
    "checkbox", GenreEL.labels);

// add event listeners for responsive validation
formEl.movieId.addEventListener("input", function () {formEl.movieId.setCustomValidity(
    Movie.checkMoviesId( formEl.movieId.value).message);
});
formEl.title.addEventListener("input", function () {formEl.title.setCustomValidity(
    Movie.checkTitle( formEl.title.value).message);
});
formEl.releaseDate.addEventListener("input", function () {formEl.releaseDate.setCustomValidity(
    Movie.checkReleaseDate( formEl.releaseDate.value).message);
});

formEl.movieId.addEventListener("input", function () {formEl.movieId.setCustomValidity(
    Movie.checkMoviesId( formEl.movieId.value).message);
});




// mandatory value check
ratingFieldsetEl.addEventListener("click", function () {
  formEl.rating[0].setCustomValidity(
      (!ratingFieldsetEl.getAttribute("data-value")) ?
          "A rating must be selected!":"" );
});
// mandatory value check
genreFieldsetEl.addEventListener("click", function () {
  const val = genreFieldsetEl.getAttribute("data-value");
  formEl.genre[0].setCustomValidity(
      (!val || Array.isArray(val) && val.length === 0) ?
          "At least one genre form must be selected!":"" );
});


function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}

// Set an event handler for the submit/save button
saveButton.addEventListener("click", function () {
  const director = new Person({ personId: generateRandomInteger(1, 1000000), name: directorNameEl.value });
  const actors = new Person({ personId: generateRandomInteger(1, 1000000), name: actorNameEl.value });

  const slots = {
    movieId: formEl.movieId.value,
    title: formEl.title.value,
    releaseDate: formEl.releaseDate.value,
    rating: ratingFieldsetEl.getAttribute("data-value"),
    genre: JSON.parse( genreFieldsetEl.getAttribute("data-value")),
    director: director, // director is a Person object
    actors: actors // actors is a Person object
  };

  console.log(slots)
  // set error messages in case of constraint violations
  formEl.movieId.setCustomValidity( Movie.checkMoviesId( slots.movieId).message);
  formEl.title.setCustomValidity( Movie.checkTitle( slots.title).message);
  formEl.releaseDate.setCustomValidity( Movie.checkReleaseDate( slots.releaseDate).message);
  formEl.rating[0].setCustomValidity(
      Movie.checkRating( slots.rating).message);
  formEl.genre[0].setCustomValidity(
      Movie.checkGenre( slots.genre).message);

  console.log(slots)

  if (formEl.checkValidity()) Movie.add( slots);
});

// neutralize the submit event
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  formEl.reset();
});

// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);

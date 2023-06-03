/**
 * @fileOverview  View methods for the use case "update movie"
 * @author Gerd Wagner
 */
import Movie, {GenreEL, MovieRatingEL} from "../m/Movie.mjs";
import {createChoiceWidget, fillSelectWithOptions} from "../../lib/util.mjs";

const formEl = document.forms["Movie"],
    saveButton = formEl["commit"],
    selectMovieEl = formEl["selectMovie"],
    ratingEL = formEl.querySelector("fieldset[data-bind='rating']"),
    genreEL = formEl.querySelector("fieldset[data-bind='genre']");
// load all movie records
Movie.retrieveAll();
// set up the movie selection list
fillSelectWithOptions(  selectMovieEl,Movie.instances, "movieId", "title");
// when a movie is selected, populate the form with its data

selectMovieEl.addEventListener("change", function () {
  const movieKey = selectMovieEl.value;
  if (movieKey) {  // set form fields
    const movie = Movie.instances[movieKey];
    createChoiceWidget( ratingEL, "rating",
        [movie.rating], "radio", MovieRatingEL.labels);

// set up the publicationForms checkbox group
    createChoiceWidget( genreEL, "genre",
        movie.genre, "checkbox", GenreEL.labels);
    ["movieId","title","releaseDate"].forEach( function (p) {
      formEl[p].value = movie[p] ? movie[p] : "";
      // delete custom validation error message which may have been set before
      formEl[p].setCustomValidity("");
    });
  } else {
    formEl.reset();
  }
});
// add event listeners for responsive validation
formEl.title.addEventListener("input", function () {
  formEl.title.setCustomValidity(
      Movie.checkTitle( formEl.title.value).message);
});
formEl.releaseDate.addEventListener("input", function () {
  formEl.releaseDate.setCustomValidity(
      Movie.checkReleaseDate( formEl.releaseDate.value).message);
});
// mandatory value check
ratingEL.addEventListener("click", function () {
  formEl.rating[0].setCustomValidity(
      (!ratingEL.getAttribute("data-value")) ?
          "A rating must be selected!" : "" );
});
// mandatory value check
genreEL.addEventListener("click", function () {
  const val = genreEL.getAttribute("data-value");
  formEl.genre[0].setCustomValidity(
      (!val || Array.isArray(val) && val.length === 0) ?
          "At least one genre form must be selected!" : "" );
});

// set an event handler for the submit/save button
saveButton.addEventListener("click", handleSaveButtonClickEvent);
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  formEl.reset();
});
// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);

// event handler for the submit/save button
function handleSaveButtonClickEvent () {
  const formEl = document.forms['Movie'],
      selectMovieEl = formEl.selectMovie;
  const slots = { movieId: formEl.movieId.value,
    title: formEl.title.value,
    releaseDate: formEl.releaseDate.value,
    rating: ratingEL.getAttribute("data-value"),
    genre: JSON.parse( genreEL.getAttribute("data-value"))
  };
  // set error messages in case of constraint violations
  formEl.movieId.setCustomValidity( Movie.checkTitle( slots.title).message);
  formEl.releaseDate.setCustomValidity( Movie.checkReleaseDate( slots.releaseDate).message);
  if (formEl.checkValidity()) {
    Movie.update( slots);
    // update the selection list option
    selectMovieEl.options[selectMovieEl.selectedIndex].text = slots.title;
  }
}

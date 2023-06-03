
import Movie, {GenreEL, MovieRatingEL} from "../m/Movie.mjs";
import {createChoiceWidget, fillSelectWithOptions} from "../../lib/util.mjs";
import Person from "../m/Person.mjs";
import Enumeration from "../../lib/Enumeration.mjs";


const formEl = document.forms["Movie"],
    ratingFieldsetEl = formEl.querySelector("fieldset[data-bind='rating']"),
    genreFieldsetEl = formEl.querySelector("fieldset[data-bind='genre']"),
    saveButton = formEl["commit"], actorSelectEl = formEl["actorNames"]; ;
const MovieCategoryEL = new Enumeration(["Biography", "TVSeriesEpisode"]);



const categorySelectEl = formEl["category"];


// Füllt das Schauspieler-Select-Feld
window.onload = function() {
  // Andere Funktionen...

  // Fülle das Schauspieler-Select-Feld
  populateActorSelect();
};

function populateActorSelect() {

}

function fillActorsSelect() {
  let persons = JSON.parse(localStorage.getItem('actors'));
  console.log(persons);
  for (let key in persons) {
    console.log(key);
    let optionEl = document.createElement("option");
    optionEl.text = persons[key].name;
    optionEl.value = persons[key].personId;
    actorSelectEl.add(optionEl, null);
  }
}



fillActorsSelect();

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

let directors = JSON.parse(localStorage.getItem('directors')) || [];
function populateDirectorDropdown() {
  const dropdown = document.getElementById('directorDropdown');
  dropdown.innerHTML = '';
  directors.forEach(director => {
    const option = document.createElement('option');
    option.value = director.personId;
    option.textContent = director.name;
    dropdown.appendChild(option);
  });
}

window.onload = populateDirectorDropdown;




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
  const actorsArray = Array.from(actorSelectEl.selectedOptions)
      .map(option => {
        const actorId = option.value;
        const actorName = option.text;
        const actor = new Person(actorId, actorName);

        // Save actor to localStorage
        localStorage.setItem(`actors`, JSON.stringify(actor));

        return actor;
      });

  const selectedCategory = categorySelectEl.value;

console.log(selectedCategory)

  console.log(actorsArray)
  const directorId = document.getElementById('directorDropdown').value;
  const director = directors.find(director => director.personId == directorId);

  const slots = {
    movieId: formEl.movieId.value,
    title: formEl.title.value,
    releaseDate: formEl.releaseDate.value,
    rating: ratingFieldsetEl.getAttribute("data-value"),
    genre: JSON.parse( genreFieldsetEl.getAttribute("data-value")),
    director: director, // director is a Person object
    actors: actorsArray, // actors is a Person object
  };

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

/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @author Gerd Wagner
 */
import Movie, {GenreEL, MovieRatingEL} from "../m/Movie.mjs";

const tableBodyEl = document.querySelector("table#movies>tbody");
// retrieve all book records
Movie.retrieveAll();
// list all book records
for (let key of Object.keys( Movie.instances)) {
    const movie = Movie.instances[key];
    const row = tableBodyEl.insertRow();
    console.log(movie.director.name)
    row.insertCell().textContent = movie.movieId;
    row.insertCell().textContent = movie.title;
    row.insertCell().textContent = movie.releaseDate;
    row.insertCell().textContent = MovieRatingEL.labels[movie.rating];
    let genre = "";
    movie.genre.forEach((value, index) => genre += GenreEL.labels[value] + ",")

    row.insertCell().textContent = genre;
    // add director and actor cells
    row.insertCell().textContent = movie.director.name;
    let actors = "";
    movie.actors.forEach((value, index) => actors += value.toString() + ",");

    row.insertCell().textContent = actors;
}

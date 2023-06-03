import Director from "../m/Director.mjs";
import Movie from "../m/Movie.mjs";

let directors = JSON.parse(localStorage.getItem('directors')) || [];

function createDirector() {
    var id = document.getElementById('directorId').value;
    var name = document.getElementById('directorName').value;
    var director = new Director({personId: id, name: name});
    directors.push(director);
    localStorage.setItem('directors', JSON.stringify(directors));
    refreshDirectorList();
    populateDirectorSelect();
}

function updateDirector() {
    var id = document.getElementById('directorId').value;
    var name = document.getElementById('directorName').value;
    for (let i = 0; i < directors.length; i++) {
        if (directors[i].personId == id) {
            directors[i].name = name;
            break;
        }
    }
    localStorage.setItem('directors', JSON.stringify(directors));
    refreshDirectorList();
    populateDirectorSelect();
}

function deleteDirector() {
    var id = document.getElementById('directorId').value;
    for (let i = 0; i < directors.length; i++) {
        if (directors[i].personId == id) {
            directors.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('directors', JSON.stringify(directors));
    refreshDirectorList();
    populateDirectorSelect();
    clearDirectorFields();
}

function refreshDirectorList() {
    const directorList = document.getElementById('directorList');
    directorList.innerHTML = '';
    directors.forEach(director => {
        console.log(director)
        const li = document.createElement('li');
        li.textContent = `${director.name} (ID: ${director.personId})`;
        directorList.appendChild(li);
    });
}

function populateDirectorSelect() {
    const directorSelect = document.getElementById('directorSelect');
    directorSelect.innerHTML = '';
    directors.forEach(director => {
        const option = document.createElement('option');
        option.value = director.personId;
        option.textContent = `${director.name} (ID: ${director.personId})`;
        directorSelect.appendChild(option);
    });
    directorSelect.addEventListener('change', selectDirector);
}

function selectDirector() {
    const id = this.value;
    const selectedDirector = directors.find(director => director.personId == id);
    if (selectedDirector) {
        document.getElementById('directorId').value = selectedDirector.personId;
        document.getElementById('directorName').value = selectedDirector.name;
    }
}

function clearDirectorFields() {
    document.getElementById('directorId').value = '';
    document.getElementById('directorName').value = '';
}

function populateMovieDropdown() {
    Movie.retrieveAll();
    const dropdown = document.getElementById('movieDropdown');
    for (let key of Object.keys(Movie.instances)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = Movie.instances[key].title;
        dropdown.appendChild(option);
    }
}

window.onload = function() {
    populateMovieDropdown();
    refreshDirectorList();
    populateDirectorSelect();
}

function addTestData() {
    const testData = [
        {personId: 1, name: "Stephen Frears"},
        {personId: 2, name: "George Lucas"},
        {personId: 3, name: "Quentin Tarantino"},
        {personId: 5, name: "Uma Thurman"},
        {personId: 6, name: "John Travolta"},
        {personId: 7, name: "Ewan McGregor"},
        {personId: 8, name: "Natalie Portman"},
        {personId: 9, name: "Keanu Reeves"},
    ];

    testData.forEach(data => {
        var director = new Director(data.personId, data.name);
        directors.push(director);
    });

    localStorage.setItem('directors', JSON.stringify(directors));
    refreshDirectorList();
    populateDirectorSelect();
}
function deleteAllDirectors() {
    directors = [];
    localStorage.setItem('directors', JSON.stringify(directors));
    refreshDirectorList();
    populateDirectorSelect();
    clearDirectorFields();
}

document.getElementById('createDirectorButton').addEventListener('click', createDirector);
document.getElementById('updateDirectorButton').addEventListener('click', updateDirector);
document.getElementById('deleteDirectorButton').addEventListener('click', deleteDirector);
document.getElementById('addTestDataButton').addEventListener('click', addTestData);
document.getElementById('selectMovie').addEventListener('click', selectMovie);
document.getElementById('deleteAllDirectorsButton').addEventListener('click', deleteAllDirectors);
import Actor from "../m/Actor.mjs";
import Movie from "../m/Movie.mjs";
import Person from "../m/Person.mjs";

let actors = JSON.parse(localStorage.getItem('actors')) || [];
console.log(actors);
console.log(actors)
function createActor() {
    var id = document.getElementById('actorId').value;
    var name = document.getElementById('actorName').value;
    var actor = new Actor( id, name);
    actors.push(actor);
    localStorage.setItem('actors', JSON.stringify(actors));
    refreshActorList();
    populateActorSelect();
}

function updateActor() {
    var id = document.getElementById('actorId').value;
    var name = document.getElementById('actorName').value;
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].personId == id) {
            actors[i].name = name;
            break;
        }
    }
    localStorage.setItem('actors', JSON.stringify(actors));
    refreshActorList();
    populateActorSelect();
}

function deleteActor() {
    var id = document.getElementById('actorId').value;
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].personId == id) {
            actors.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('actors', JSON.stringify(actors));
    refreshActorList();
    populateActorSelect();
    clearActorFields();
}

function refreshActorList() {
    const actorList = document.getElementById('actorList');
    actorList.innerHTML = '';
    actors.forEach(actor => {
        console.log(actor)
        const li = document.createElement('li');
        li.textContent = `${actor.name} (ID: ${actor.personId})`;
        actorList.appendChild(li);
    });
}

function populateActorSelect() {
    const actorSelect = document.getElementById('actorSelect');
    actorSelect.innerHTML = '';
    actors.forEach(actor => {
        const option = document.createElement('option');
        option.value = actor.personId;
        option.textContent = `${actor.name} (ID: ${actor.personId})`;
        actorSelect.appendChild(option);
    });
    actorSelect.addEventListener('change', selectActor);
}

function selectActor() {
    const id = this.value;
    const selectedActor = actors.find(actor => actor.personId == id);
    if (selectedActor) {
        document.getElementById('actorId').value = selectedActor.personId;
        document.getElementById('actorName').value = selectedActor.name;
    }
}

function clearActorFields() {
    document.getElementById('actorId').value = '';
    document.getElementById('actorName').value = '';
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
    refreshActorList();
    populateActorSelect();
}



function addTestData() {
    const testData = [
        { personId: 1, name: "Stephen Frears" },
        { personId: 2, name: "George Lucas" },
        { personId: 3, name: "Quentin Tarantino" },
        { personId: 5, name: "Uma Thurman" },
        { personId: 6, name: "John Travolta" },
        { personId: 7, name: "Ewan McGregor" },
        { personId: 8, name: "Natalie Portman" },
        { personId: 9, name: "Keanu Reeves" },
    ];

    testData.forEach(data => {
        var actor = new Actor(data.personId, data.name);
        actors.push(actor);
    });

    localStorage.setItem('actors', JSON.stringify(actors));
    refreshActorList();
    populateActorSelect();
}

function deleteAllActors() {
    actors = [];
    localStorage.setItem('actors', JSON.stringify(actors));
    refreshActorList();
    populateActorSelect();
    clearActorFields();
}


document.getElementById('createActorButton').addEventListener('click', createActor);
document.getElementById('updateActorButton').addEventListener('click', updateActor);
document.getElementById('deleteActorButton').addEventListener('click', deleteActor);
document.getElementById('addTestDataButton').addEventListener('click', addTestData);
document.getElementById('selectMovie').addEventListener('click', selectMovie);
document.getElementById('deleteAllActorsButton').addEventListener('click', deleteAllActors);




import Person from "../m/Person.mjs";
import Movie from "../m/Movie.mjs";

let persons = JSON.parse(localStorage.getItem('persons')) || [];

function createPerson() {
    var id = document.getElementById('personId').value;
    var name = document.getElementById('personName').value;
    var person = new Person(id, name);
    persons.push(person);
    localStorage.setItem('persons', JSON.stringify(persons));
    refreshPersonList();
    populatePersonSelect();
}

function updatePerson() {
    var id = document.getElementById('personId').value;
    var name = document.getElementById('personName').value;
    for (let i = 0; i < persons.length; i++) {
        if (persons[i].personId == id) {
            persons[i].name = name;
            break;
        }
    }
    localStorage.setItem('persons', JSON.stringify(persons));
    refreshPersonList();
    populatePersonSelect();
}

function deletePerson() {
    var id = document.getElementById('personId').value;
    for (let i = 0; i < persons.length; i++) {
        if (persons[i].personId == id) {
            persons.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('persons', JSON.stringify(persons));
    refreshPersonList();
    populatePersonSelect();
    clearPersonFields();
}

function refreshPersonList() {
    const personList = document.getElementById('personList');
    personList.innerHTML = '';
    persons.forEach(person => {
        const li = document.createElement('li');
        li.textContent = `${person.name} (ID: ${person.personId})`;
        personList.appendChild(li);
    });
}

function populatePersonSelect() {
    const personSelect = document.getElementById('personSelect');
    personSelect.innerHTML = '';
    persons.forEach(person => {
        const option = document.createElement('option');
        option.value = person.personId;
        option.textContent = `${person.name} (ID: ${person.personId})`;
        personSelect.appendChild(option);
    });
    personSelect.addEventListener('change', selectPerson);
}

function selectPerson() {
    const id = this.value;
    const selectedPerson = persons.find(person => person.personId == id);
    if (selectedPerson) {
        document.getElementById('personId').value = selectedPerson.personId;
        document.getElementById('personName').value = selectedPerson.name;
    }
}

function clearPersonFields() {
    document.getElementById('personId').value = '';
    document.getElementById('personName').value = '';
}

function selectMovie() {
    const dropdown = document.getElementById('movieDropdown');
    const selectedMovieId = dropdown.value;

    // Führen Sie hier Aktionen mit dem ausgewählten Film durch
    console.log(`Selected movie: ${selectedMovieId}`);
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

window.onload = populateMovieDropdown;




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
        var person = new Person(data.personId, data.name);
        persons.push(person);
    });

    localStorage.setItem('persons', JSON.stringify(persons));
    refreshPersonList();
    populatePersonSelect();
}


document.getElementById('createPersonButton').addEventListener('click', createPerson);
document.getElementById('updatePersonButton').addEventListener('click', updatePerson);
document.getElementById('deletePersonButton').addEventListener('click', deletePerson);
document.getElementById('addTestDataButton').addEventListener('click', addTestData);
document.getElementById('selectMovie').addEventListener('click', selectMovie);

refreshPersonList();
populatePersonSelect();

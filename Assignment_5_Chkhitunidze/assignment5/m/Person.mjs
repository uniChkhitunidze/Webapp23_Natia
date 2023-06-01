class Person {
    constructor(personId, name) {
        this.personId = personId;
        this.name = name;
        this.directedMovies = [];
        this.playedMovies = [];
    }

    addDirectedMovie(movie) {
        this.directedMovies.push(movie);
        this.saveToLocalStorage();
    }

    addPlayedMovie(movie) {
        this.playedMovies.push(movie);
        this.saveToLocalStorage();
    }

    getDirectedMovies() {
        return this.directedMovies;
    }

    getPlayedMovies() {
        return this.playedMovies;
    }

    setDirectedMovies(directedMovies) {
        this.directedMovies = directedMovies;
        this.saveToLocalStorage();
    }

    setPlayedMovies(playedMovies) {
        this.playedMovies = playedMovies;
        this.saveToLocalStorage();
    }


    saveToLocalStorage() {

        let persons = JSON.parse(localStorage.getItem('persons')) || [];


        let existingIndex = persons.findIndex(p => p.personId === this.personId);


        let data = {
            personId: this.personId,
            name: this.name,
            directedMovies: this.directedMovies,
            playedMovies: this.playedMovies
        };

        if (existingIndex !== -1) {

            persons[existingIndex] = data;
        } else {

            persons.push(data);
        }


        localStorage.setItem('persons', JSON.stringify(persons));
    }


    static loadFromLocalStorage(personId) {

        let persons = JSON.parse(localStorage.getItem('persons')) || [];


        let data = persons.find(p => p.personId === personId);

        if (data) {

            let person = new Person(data.personId, data.name);
            person.setDirectedMovies(data.directedMovies);
            person.setPlayedMovies(data.playedMovies);
            return person;
        } else {

            return null;
        }
    }
}

export default Person;


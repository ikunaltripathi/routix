'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    constructor(coords, distance, duration) {
        this.coords= coords;
        this.distance = distance;
        this.duration = duration;
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }
    
    calcPace() {
        this.pace = this.duration/this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }
    
    calcSpeed() {
        this.speed = this.distance/this.duration;
        return this.speed;
    }
}

const run1 = new Running([59, -12], 13, 2, 133);
console.log(run1);

///// APPLICATION Architecture

class App {
    #map;
    #mapEvent;
    constructor() {
        this._getPosition();
        // forms default behaviour reloads the page
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('click', this._toggleElevationField);
    }

    _getPosition() { // navigator obj. is the prpty of window obj.
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
        alert('Location can\'t be fetched');
        });

    }

    _loadMap(position) {
            const {latitude} = position.coords; // use destructuring always when taking things out the obj.
            const {longitude} = position.coords;
            const coords = [latitude, longitude];
            this.#map = L.map('map').setView(coords, 13); // pass the html ele id inside, L is a global variable inside the script of leaflet, all the global variables in a script can be accessed in other scripts which are loaded after them of course. 2nd arg is zoom lvl. storing the map created cuz setview would be returning and obj on which we can diff meths.
            // console.log(map);
        
        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        // adding an event listener but using leaflet
        this.#map.on('click', this._showForm.bind(this));
    }

    _setLocalStorage() {

    }

    _getLocalStorage() {

    }

    _newWorkout(e) {
            e.preventDefault();
            inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '';
            const {lat, lng} = this.#mapEvent.latlng;
            L.marker([lat, lng]).addTo(this.#map)
                .bindPopup(L.popup({ // Read the documentation for understanding behind the scenes.
                    maxWidth : 250,
                    minWidth : 100,
                    autoClose : false,
                    closeOnClick : false,
                    className : 'running-popup'
            }))
                .setPopupContent('Workout') // returns this so chain
                .openPopup();
    }

    _renderWorkout(workout) {
    }

    _renderWorkoutMarker() {}
    
    _showForm(mapE){ // for using an arg anywhere else create a global var for that.
            this.#mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();
            // console.log(mapEvent);
    }
    
    _hideForm(){
        
    }

    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden'); // closest thing doing cuz need to deal with div not the label this is the viable way cuz all the divs have the same classes so another way could be selecting both the divs seperately and toggling them.
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');    

    }
    _moveToPopup(e){}

    reset(){}
}

const app = new App();


// arch -> for more complex proj we could have divided the architecture into business and data logic. (Business logic dealing with underlying data)
// Get the arch from the slides then shift all event listeners to the const and make every callback a seperate func. Bind the this keyword while calling the callback as adding eventListener makes this point to the dom ele on which it was called.
// While creating arch focus on creating a new parent class if they have something in common.

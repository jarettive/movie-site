"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const axios_1 = require("axios");
const Movies = require("./movieCell");
const TopHeader_1 = require("./TopHeader");
const SecondHeader_1 = require("./SecondHeader");
exports.theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc";
exports.theMDBURL = "https://api.themoviedb.org/3/";
exports.lang = "&language=en-US";
exports.img300_450_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";
exports.theMDBGenreMap = {};
exports.popularGenres = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "More"];
exports.otherGenres = ["Sci-fi", "Animation", "Musical", "Documentary"];
class CurrMovieList {
    constructor() {
        this.name = "CurrMovieList";
        this.observers = [];
        this.movies = [];
        this.setMovies = (movies) => {
            this.movies = movies;
            this.notifyObservers("listChanged");
        };
        this.setCurrMovie = (movieID) => {
            if (movieID == "") {
                this.notifyObservers("movieUnset");
                return;
            }
            this.currMovie = this.movies.find((element) => {
                return element.id == movieID;
            });
            this.notifyObservers("movieChanged");
        };
        this.getMovies = () => {
            return this.movies;
        };
    }
    notifyObservers(event) {
        this.observers.forEach(element => {
            element.notified(this, event);
        });
    }
}
exports.CurrMovieList = CurrMovieList;
exports.movieList = new CurrMovieList();
class MovieGrid extends React.Component {
    constructor() {
        super(...arguments);
        this.mov = [];
        this.state = { movies: this.mov, shown: true };
    }
    observe(ob) {
        ob.observers.push(this);
    }
    notified(observable, event) {
        if (event == "listChanged") {
            observable;
            this.setState({ movies: observable.getMovies() });
        }
        if (event == "movieChanged") {
            this.setState({ shown: false });
        }
        if (event === "movieUnset") {
            this.setState({ shown: true });
        }
    }
    componentWillMount() {
        this.observe(exports.movieList);
        axios_1.default.get(exports.theMDBURL + "genre/movie/list?" + exports.theMDBKey + exports.lang).then((response) => {
            ;
            response.data.genres.forEach((genre) => {
                exports.theMDBGenreMap[genre.name] = genre.id;
            });
        });
    }
    render() {
        let row1Movies = [];
        let row2Movies = [];
        if (this.state.movies && this.state.movies.length >= 10) {
            row1Movies = this.state.movies.slice(0, 5);
            row2Movies = this.state.movies.slice(5, 10);
        }
        return (React.createElement("div", { id: "movieGrid", className: this.state.shown ? "shown" : "hidden" }, React.createElement(React.Fragment, null,
            React.createElement(Movies.MovieRow, { rowMovies: row1Movies }),
            React.createElement(Movies.MovieRow, { rowMovies: row2Movies }))));
    }
}
class MainBody extends React.Component {
    render() {
        return (React.createElement("div", { id: "mainBody" },
            React.createElement(MovieGrid, null),
            React.createElement(SoloMovieDisplay, null)));
    }
}
class SoloMovieDisplay extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { shown: false };
    }
    observe(ob) {
        ob.observers.push(this);
    }
    notified(observable, event) {
        if (event == "movieChanged") {
            this.setState({ shown: true });
        }
        if (event === "movieUnset") {
            this.setState({ shown: false });
        }
    }
    componentWillMount() {
        this.observe(exports.movieList);
    }
    exit() {
        console.log("exiting");
        exports.movieList.setCurrMovie("");
    }
    render() {
        return (React.createElement("div", { id: "soloMovieDisplay", className: this.state.shown ? "shown" : "hidden" },
            React.createElement("div", { onClick: this.exit }, "sldkfjslkdfj")));
    }
}
class MainPage extends React.Component {
    componentWillMount() {
        const contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1";
        axios_1.default.get(exports.theMDBURL + "discover/movie?" + exports.theMDBKey + contentStr).then((response) => {
            exports.movieList.setMovies(response.data.results);
        });
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(TopHeader_1.TopHeader, null),
            React.createElement(SecondHeader_1.SecondHeader, null),
            React.createElement(MainBody, null)));
    }
}
exports.MainPage = MainPage;
class SigninPopup extends React.Component {
    constructor() {
        super(...arguments);
        this.closePopup = () => {
            this.props.closePopup();
        };
        this.handleInner = (event) => {
            event.stopPropagation();
        };
    }
    render() {
        return (React.createElement("div", { id: "signinPopup", onClick: this.closePopup, className: "popup" },
            React.createElement("div", { className: "popup_inner", onClick: this.handleInner })));
    }
}
exports.SigninPopup = SigninPopup;
//# sourceMappingURL=MainPage.js.map
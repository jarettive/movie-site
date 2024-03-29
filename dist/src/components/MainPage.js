"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const axios_1 = require("axios");
const MovieGrid_1 = require("./MovieGrid");
const TopHeader_1 = require("./TopHeader");
const SecondHeader_1 = require("./SecondHeader");
const Utilities_1 = require("./Utilities");
const SoloDisplay_1 = require("./SoloDisplay");
const MaybeList_1 = require("./MaybeList");
const FilterPage_1 = require("./FilterPage");
const $ = require("jquery");
exports.img300_450_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";
exports.img600_900_url = "https://image.tmdb.org/t/p/w600_and_h900_bestv2";
exports.theMDBGenreMap = {};
exports.popularGenres = ["All", "Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "More"];
exports.otherGenres = ["Sci-fi", "Animation", "Musical", "Documentary"];
class MainBus {
    constructor() {
        this.observers = [];
        this.notifyObservers = (event) => {
            this.observers.forEach(element => {
                element.notified(this, event);
            });
        };
    }
}
exports.mainBus = new MainBus();
class CurrMovieList {
    constructor() {
        this.name = "CurrMovieList";
        this.observers = [];
        this.movies = [];
        this.currGenre = "";
        this.unFilteredCount = 0;
        this.filterList = (list) => {
            var filters = Utilities_1.userFilters.getFilters();
            if (filters.length > 0) {
                for (var idx in list) {
                    var movie = list[idx];
                    movie.filtered = true;
                    movie.myFilterData.view_service.forEach((service) => {
                        filters.forEach((filter) => {
                            var pref = filter.userPref || filter.default;
                            if (filter.name == service && pref == "yes") {
                                movie.filtered = false;
                            }
                        });
                    });
                }
            }
        };
        this.setMovies = (movies) => {
            this.movies = movies;
            this.filterList(this.movies);
            this.notifyObservers("listChanged");
        };
        this.getGenre = () => {
            return this.currGenre;
        };
        this.addMovies = (movs) => {
            this.filterList(movs);
            this.movies = this.movies.concat(movs);
            this.notifyObservers("listChanged");
        };
        this.setGenre = (genre) => {
            if (this.currGenre != genre) {
                this.currGenre = genre;
                this.notifyObservers("genreChanged");
            }
        };
        this.setCurrMovie = (movieID) => {
            this.currMovie = this.movies.find((element) => {
                return element.id == movieID;
            });
            if (!this.currMovie || !this.currMovie.imdb_id) {
                axios_1.default.get("getMovie", { params: { movieID: movieID } }).then((response) => {
                    this.currMovie = response.data;
                    this.notifyObservers("movieChanged");
                });
            }
            this.notifyObservers("movieChanged");
        };
        this.getMovies = () => {
            return this.movies;
        };
    }
    observe(ob) {
        ob.observers.push(this);
    }
    notified(observable, event) {
        this.filterList(this.movies);
        this.notifyObservers("filtersChanged");
    }
    getcurrMovie() {
        return this.currMovie;
    }
    notifyObservers(event) {
        this.observers.forEach(element => {
            element.notified(this, event);
        });
    }
}
exports.CurrMovieList = CurrMovieList;
exports.movieList = new CurrMovieList();
exports.movieList.observe(Utilities_1.userFilters);
var mainview;
(function (mainview) {
    mainview[mainview["grid"] = 0] = "grid";
    mainview[mainview["solo"] = 1] = "solo";
    mainview[mainview["filters"] = 2] = "filters";
    mainview[mainview["last"] = 3] = "last";
})(mainview = exports.mainview || (exports.mainview = {}));
;
class MainBody extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { showingChild: mainview.grid, last: mainview.last, changedFilter: false };
        this.movies = [];
        this.childCallback = (child) => {
            if (child == mainview.last) {
                child = this.state.last;
            }
            var last = (child == this.state.showingChild) ? this.state.last : this.state.showingChild;
            this.setState({ showingChild: child, last: last });
        };
    }
    componentWillMount() {
        this.observe(exports.movieList);
        this.observe(exports.mainBus);
        axios_1.default.get("/genres").then((response) => {
            ;
            response.data.genres.forEach((genre) => {
                exports.theMDBGenreMap[genre.name] = genre.id;
            });
        });
    }
    observe(ob) {
        ob.observers.push(this);
    }
    notified(observable, event) {
        var show = this.state.showingChild;
        var filterChanged = false;
        if (event == "movieChanged") {
            show = mainview.solo;
        }
        if (event == "genreChanged") {
            show = mainview.grid;
            $("#preferenceHeader").css({ visibility: "" });
        }
        if (event == "listChanged") {
            this.movies = exports.movieList.getMovies();
        }
        if (event == "filtersChanged") {
            this.movies = exports.movieList.getMovies();
            filterChanged = true;
        }
        if (event == "showFilters") {
            show = mainview.filters;
        }
        var last = (show == this.state.showingChild) ? this.state.last : this.state.showingChild;
        this.setState({ showingChild: show, last: last, changedFilter: filterChanged });
    }
    render() {
        var result = (React.createElement("div", { id: "mainBody" },
            React.createElement(MovieGrid_1.MovieGrid, { item: { callBack: this.childCallback, show: this.state.showingChild == mainview.grid }, movies: this.movies, changedFilter: this.state.changedFilter, genre: exports.movieList.getGenre() }),
            React.createElement(SoloDisplay_1.SoloMovieDisplay, { item: { callBack: this.childCallback, show: this.state.showingChild == mainview.solo }, movie: exports.movieList.getcurrMovie() }),
            React.createElement(FilterPage_1.FilterPage, { item: { callBack: this.childCallback, show: this.state.showingChild == mainview.filters } })));
        return result;
    }
}
class MainPage extends React.Component {
    componentWillMount() {
        axios_1.default.get("getGenre").then((response) => {
            exports.movieList.setMovies(response.data.results);
        });
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(TopHeader_1.TopHeader, null),
            React.createElement(SecondHeader_1.SecondHeader, null),
            React.createElement(MainBody, null),
            React.createElement(MaybeList_1.MaybeListComponent, null)));
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
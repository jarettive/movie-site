"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var axios_1 = require("axios");
var Movies = require("./movieCell");
var TopHeader_1 = require("./TopHeader");
var SecondHeader_1 = require("./SecondHeader");
exports.theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc";
exports.theMDBURL = "https://api.themoviedb.org/3/";
exports.lang = "&language=en-US";
exports.img300_450_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";
exports.theMDBGenreMap = {};
exports.popularGenres = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "More"];
exports.otherGenres = ["Sci-fi", "Animation", "Musical", "Documentary"];
var CurrMovieList = /** @class */ (function () {
    function CurrMovieList() {
        var _this = this;
        this.name = "CurrMovieList";
        this.observers = [];
        this.movies = [];
        this.setMovies = function (movies) {
            _this.movies = movies;
            _this.notifyObservers();
        };
        this.getMovies = function () {
            return _this.movies;
        };
    }
    CurrMovieList.prototype.notifyObservers = function () {
        var _this = this;
        this.observers.forEach(function (element) {
            element.notified(_this);
        });
    };
    return CurrMovieList;
}());
exports.CurrMovieList = CurrMovieList;
exports.movieList = new CurrMovieList();
var MainBody = /** @class */ (function (_super) {
    __extends(MainBody, _super);
    function MainBody() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // readonly state = {mov : null};
        _this.mov = [];
        _this.state = { movies: _this.mov };
        return _this;
    }
    MainBody.prototype.observe = function (ob) {
        ob.observers.push(this);
    };
    MainBody.prototype.notified = function (observable) {
        if (observable instanceof CurrMovieList) {
            observable;
            this.setState({ movies: observable.getMovies() });
        }
    };
    MainBody.prototype.componentWillMount = function () {
        this.observe(exports.movieList);
        axios_1.default.get(exports.theMDBURL + "genre/movie/list?" + exports.theMDBKey + exports.lang).then(function (response) {
            ;
            response.data.genres.forEach(function (genre) {
                exports.theMDBGenreMap[genre.name] = genre.id;
            });
        });
    };
    MainBody.prototype.render = function () {
        var row1Movies = [];
        var row2Movies = [];
        if (this.state.movies && this.state.movies.length >= 10) {
            row1Movies = this.state.movies.slice(0, 5);
            row2Movies = this.state.movies.slice(5, 10);
        }
        return (React.createElement("div", { id: "mainBody" }, React.createElement(React.Fragment, null,
            React.createElement(Movies.MovieRow, { rowMovies: row1Movies }),
            React.createElement(Movies.MovieRow, { rowMovies: row2Movies }))));
    };
    return MainBody;
}(React.Component));
var MainPage = /** @class */ (function (_super) {
    __extends(MainPage, _super);
    function MainPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainPage.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(TopHeader_1.TopHeader, null),
            React.createElement(SecondHeader_1.SecondHeader, null),
            React.createElement(MainBody, null)));
    };
    return MainPage;
}(React.Component));
exports.MainPage = MainPage;
var SigninPopup = /** @class */ (function (_super) {
    __extends(SigninPopup, _super);
    function SigninPopup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.closePopup = function () {
            _this.props.closePopup();
        };
        _this.handleInner = function (event) {
            event.stopPropagation();
        };
        return _this;
    }
    SigninPopup.prototype.render = function () {
        return (React.createElement("div", { id: "signinPopup", onClick: this.closePopup, className: "popup" },
            React.createElement("div", { className: "popup_inner", onClick: this.handleInner })));
    };
    return SigninPopup;
}(React.Component));
exports.SigninPopup = SigninPopup;
//# sourceMappingURL=MainPage.js.map
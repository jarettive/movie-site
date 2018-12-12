"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MainPage_1 = require("./MainPage");
const Utilities_1 = require("./Utilities");
const $ = require("jquery");
const MaybeList_1 = require("./MaybeList");
exports.moviesPerPage = 14;
class MoviePage extends React.Component {
    render() {
        let row1Movies = [];
        let row2Movies = [];
        if (this.props.movies && this.props.movies.length >= exports.moviesPerPage) {
            row1Movies = this.props.movies.slice(0, exports.moviesPerPage / 2);
            row2Movies = this.props.movies.slice(exports.moviesPerPage / 2, exports.moviesPerPage);
        }
        if (this.props.movies.length < exports.moviesPerPage) {
            return (React.createElement("div", { className: "moviePage" },
                React.createElement("div", { className: "loadingSpinner" })));
        }
        return (React.createElement("div", { className: "moviePage" },
            React.createElement(React.Fragment, null,
                React.createElement(MovieRow, { rowMovies: row1Movies }),
                React.createElement(MovieRow, { rowMovies: row2Movies }))));
    }
}
class MovieGrid extends React.Component {
    constructor(props) {
        super(props);
        this.pages = [];
        this.state = { pageNumber: 0 };
        this.mov = [];
        this.unfilteredCnt = 0;
        this.retrievedPages = 1;
        this.componentWillMount = () => {
            var yes = (event) => { this.keyPress(event); };
            document.addEventListener("keydown", yes);
            this.turnPage(true);
            this.leftArrowRef = React.createRef();
        };
        this.turnPage = (right = false) => {
            if (right == false && this.state.pageNumber == 1) {
                return;
            }
            this.setState({ pageNumber: this.state.pageNumber += (right ? 1 : -1) });
            this.addMoreMovies();
            $("#moviePages").animate({ left: ((this.state.pageNumber - 1) * -100) + "%" }, 180);
        };
        this.addMoreMovies = () => {
            if ((this.state.pageNumber + 1) * exports.moviesPerPage > this.unfilteredCnt) {
                this.retrievedPages++;
                Utilities_1.getGenre(null, this.retrievedPages, true);
            }
        };
        this.componentWillReceiveProps = (props) => {
            this.pages = [];
            var j = 0;
            var pageNum = 0;
            this.unfilteredCnt = 0;
            while (j < props.movies.length) {
                var unfilteredCnt = 0;
                var page = [];
                while (unfilteredCnt < exports.moviesPerPage && j < props.movies.length) {
                    var movie = props.movies[j];
                    if (!movie.filtered) {
                        unfilteredCnt++;
                        page.push(movie);
                    }
                    j++;
                }
                this.unfilteredCnt += unfilteredCnt;
                this.pages[pageNum] = page;
                pageNum++;
            }
            if (props.genre != this.props.genre || props.changedFilter) {
                this.setState({ pageNumber: 1 });
                if (props.genre != this.props.genre) {
                    $("#moviePages").animate({ left: "0%" }, 1);
                }
                this.addMoreMovies();
            }
        };
        this.keyPress = (event) => {
            if (event.keyCode == 37) {
                this.turnPage();
            }
            else if (event.keyCode == 39) {
                this.turnPage(true);
            }
        };
    }
    render() {
        var leftArrClass = "moveArrow goLeft fas fa-caret-left " + ((this.state.pageNumber == 1) ? "hidden" : "shown");
        return (React.createElement("div", { id: "movieGrid", tabIndex: 0, className: this.props.item.show ? "shown" : "hidden" },
            React.createElement("div", { id: "moviePages" }, this.pages.map((page, idx) => {
                return React.createElement(MoviePage, { key: idx, movies: page });
            })),
            React.createElement("i", { className: "moveArrow goRight fas fa-caret-right", onClick: () => { this.turnPage(true); } }),
            React.createElement("i", { className: leftArrClass, onClick: () => { this.turnPage(); } })));
    }
}
exports.MovieGrid = MovieGrid;
class MovieRow extends React.Component {
    render() {
        let cells = [];
        if (this.props.rowMovies.length > 0) {
            cells = this.props.rowMovies;
            cells.forEach((cell) => {
                cell.img_path = MainPage_1.img300_450_url + cell.poster_path;
            });
        }
        return React.createElement("div", { className: "movieRow" }, cells.map((element, index) => {
            return React.createElement(MovieCell, { key: index, mov: element });
        }));
    }
}
exports.MovieRow = MovieRow;
class MovieCell extends React.Component {
    constructor() {
        super(...arguments);
        this.addMaybe = () => {
            MaybeList_1.maybeList.add(this.props.mov);
        };
        this.viewMovie = () => {
            MainPage_1.movieList.setCurrMovie(this.props.mov.id);
        };
    }
    render() {
        var classes = "movieCell " + (this.props.mov.filtered ? "hidden " : "");
        return (React.createElement("div", { className: classes },
            React.createElement("img", { onClick: this.viewMovie, src: this.props.mov.img_path }),
            React.createElement("i", { onClick: this.addMaybe, className: "addMovie fas fa-plus-square" },
                React.createElement("div", { className: "addMovieHelper" }, "Add to Maybe List")),
            React.createElement("div", { className: "movieTitle" }, this.props.mov.title)));
    }
}
exports.MovieCell = MovieCell;
//# sourceMappingURL=MovieGrid.js.map
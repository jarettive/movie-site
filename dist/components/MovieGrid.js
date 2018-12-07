"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MainPage_1 = require("./MainPage");
const Utilities_1 = require("./Utilities");
const rowSize = 5;
const movieCount = 6;
class MovieGrid extends React.Component {
    constructor() {
        super(...arguments);
        this.mov = [];
    }
    render() {
        let row1Movies = [];
        let row2Movies = [];
        if (this.props.movies && this.props.movies.length >= 10) {
            row1Movies = this.props.movies.slice(0, movieCount);
            row2Movies = this.props.movies.slice(movieCount, movieCount * 2);
        }
        return (React.createElement("div", { id: "movieGrid", className: this.props.item.show ? "shown" : "hidden" },
            React.createElement(React.Fragment, null,
                React.createElement(MovieRow, { rowMovies: row1Movies }),
                React.createElement(MovieRow, { rowMovies: row2Movies })),
            React.createElement("i", { className: "goRight fas fa-caret-right", onClick: Utilities_1.unimplemented }),
            React.createElement("i", { className: "goLeft fas fa-caret-left", onClick: Utilities_1.unimplemented })));
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
        return React.createElement("div", { className: "movieRow" }, cells.map((element) => {
            return React.createElement(MovieCell, { mov: element });
        }));
    }
}
exports.MovieRow = MovieRow;
class MovieCell extends React.Component {
    constructor() {
        super(...arguments);
        this.viewMovie = () => {
            MainPage_1.movieList.setCurrMovie(this.props.mov.id);
        };
    }
    render() {
        return (React.createElement("div", { className: "movieCell" },
            React.createElement("img", { onClick: this.viewMovie, src: this.props.mov.img_path }),
            React.createElement("div", { className: "movieTitle" }, this.props.mov.title)));
    }
}
exports.MovieCell = MovieCell;
//# sourceMappingURL=MovieGrid.js.map
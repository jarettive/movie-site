"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MainPage_1 = require("./MainPage");
const rowSize = 5;
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
//# sourceMappingURL=movieCell.js.map
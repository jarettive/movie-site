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
var MainPage_1 = require("./MainPage");
var rowSize = 5;
var MovieRow = /** @class */ (function (_super) {
    __extends(MovieRow, _super);
    function MovieRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MovieRow.prototype.render = function () {
        var fountain = { title: "The Fountain", poster_path: "https://m.media-amazon.com/images/M/MV5BMTU5OTczMTcxMV5BMl5BanBnXkFtZTcwNDg3MTEzMw@@._V1_.jpg" };
        var cells = Array.apply(null, new Array(rowSize)).map(function () { return fountain; });
        if (this.props.rowMovies.length > 0) {
            cells = this.props.rowMovies;
            cells.forEach(function (cell) {
                cell.poster_path = MainPage_1.img300_450_url + cell.poster_path;
            });
        }
        return React.createElement("div", { className: "movieRow" }, cells.map(function (element) {
            return React.createElement(MovieCell, { mov: element });
        }));
    };
    return MovieRow;
}(React.Component));
exports.MovieRow = MovieRow;
var MovieCell = /** @class */ (function (_super) {
    __extends(MovieCell, _super);
    function MovieCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MovieCell.prototype.render = function () {
        return (React.createElement("div", { className: "movieCell" },
            React.createElement("img", { src: this.props.mov.poster_path }),
            React.createElement("div", { className: "movieTitle" }, this.props.mov.title)));
    };
    return MovieCell;
}(React.Component));
exports.MovieCell = MovieCell;
//# sourceMappingURL=MovieCell.js.map
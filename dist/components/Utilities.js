"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Main = require("./MainPage");
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
exports.shuffleArray = shuffleArray;
function unimplemented() {
    alert("This feature is unfinished but coming soon!");
}
exports.unimplemented = unimplemented;
let lastGenre = "";
function getGenre(Genre, pageNum = 1, add = false, callBack = null) {
    var genre = Genre;
    if (genre == null) {
        genre = lastGenre;
    }
    lastGenre = genre;
    genre = (genre.toLowerCase() === "musical") ? "Music" : genre;
    genre = (genre.toLowerCase() === "sci-fi") ? "Science Fiction" : genre;
    Main.movieList.setGenre(genre);
    axios_1.default.get("getGenre", {
        params: {
            genreID: Main.theMDBGenreMap[genre],
            pageNum: pageNum
        }
    }).then((response) => {
        if (add) {
            Main.movieList.addMovies(response.data.results);
        }
        else {
            Main.movieList.setMovies(response.data.results);
        }
        if (callBack) {
            callBack();
        }
    });
}
exports.getGenre = getGenre;
;
//# sourceMappingURL=Utilities.js.map
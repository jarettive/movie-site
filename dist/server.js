"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const axios_1 = require("axios");
exports.theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc";
exports.theMDBURL = "https://api.themoviedb.org/3/";
exports.lang = "&language=en-US";
let cache = {};
app_1.app.get('/genres', function (req, res) {
    var queryStr = exports.theMDBURL + "genre/movie/list?" + exports.theMDBKey + exports.lang;
    if (cache[queryStr]) {
        res.send(cache[queryStr]);
    }
    else {
        axios_1.default.get(queryStr).then((response) => {
            res.send(response.data);
            cache[queryStr] = response.data;
        });
    }
});
app_1.app.get("/getGenre", function (req, res) {
    var contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false";
    if (req.query.genreID) {
        contentStr += "&with_genres=" + req.query.genreID;
    }
    if (req.query.pageNum) {
        contentStr += "&page=" + req.query.pageNum;
    }
    var queryStr = exports.theMDBURL + "discover/movie?" + exports.theMDBKey + contentStr;
    if (cache[queryStr]) {
        res.send(cache[queryStr]);
    }
    else {
        axios_1.default.get(queryStr).then((response) => {
            res.send(response.data);
            cache[queryStr] = response.data;
        });
    }
});
app_1.app.get("/getMovie", function (req, res) {
    var queryStr = exports.theMDBURL + "movie/" + req.query.movieID + "?" + exports.theMDBKey + exports.lang;
    if (cache[queryStr]) {
        res.send(cache[queryStr]);
    }
    else {
        axios_1.default.get(queryStr).then((response) => {
            res.send(response.data);
            cache[queryStr] = response.data;
        });
    }
});
app_1.http.listen(app_1.app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app_1.app.get("port"), app_1.app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
//# sourceMappingURL=server.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const axios_1 = require("axios");
const prefFilters = require("../pref-filters.json");
exports.theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc";
exports.theMDBURL = "https://api.themoviedb.org/3/";
exports.lang = "&language=en-US";
let cache = {};
let dummyData = {};
function generateDummyData(movies) {
    movies.forEach((movie) => {
        var movieID = movie.id;
        if (dummyData[movieID]) {
        }
        else {
            dummyData[movieID] = {};
        }
        for (var key in prefFilters) {
            if (prefFilters.hasOwnProperty(key)) {
                var obj = prefFilters[key];
                var d = Math.random();
                if (d < .4) {
                    if (!dummyData[movieID[obj["type"]]]) {
                        dummyData[movieID][obj["type"]] = [];
                    }
                    dummyData[movieID][obj["type"]].push(obj["name"]);
                }
            }
        }
        movie.myFilterData = dummyData[movieID];
    });
}
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
            generateDummyData(response.data.results);
            res.send(response.data);
            cache[queryStr] = response.data;
        });
    }
});
app_1.app.get("/search", function (req, res) {
    var queryStr = exports.theMDBURL + "search/movie?" + exports.theMDBKey + exports.lang + "&page=1&include_adult=false&query=" + req.query.queryStr;
    axios_1.default.get(queryStr).then((response) => {
        res.send(response.data);
    });
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
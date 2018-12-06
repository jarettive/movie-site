"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const axios_1 = require("axios");
exports.theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc";
exports.theMDBURL = "https://api.themoviedb.org/3/";
exports.lang = "&language=en-US";
app_1.app.get('/genres', function (req, res) {
    axios_1.default.get(exports.theMDBURL + "genre/movie/list?" + exports.theMDBKey + exports.lang).then((response) => {
        res.send(response.data);
    });
});
app_1.app.get("/getGenre", function (req, res) {
    const contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_genres=" + req.query.genreID;
    axios_1.default.get(exports.theMDBURL + "discover/movie?" + exports.theMDBKey + contentStr).then((response) => {
        res.send(response.data);
    });
});
app_1.app.get("/getPopular", function (req, res) {
    const contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1";
    axios_1.default.get(exports.theMDBURL + "discover/movie?" + exports.theMDBKey + contentStr).then((response) => {
        res.send(response.data);
    });
});
app_1.app.get("/getMovie", function (req, res) {
    axios_1.default.get(exports.theMDBURL + "movie/" + req.query.movieID + "?" + exports.theMDBKey + exports.lang).then((response) => {
        res.send(response.data);
    });
});
app_1.http.listen(app_1.app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app_1.app.get("port"), app_1.app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
//# sourceMappingURL=server.js.map
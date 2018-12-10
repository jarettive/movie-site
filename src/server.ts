import { http, app } from "./app";
import {con} from "./db";
import axios from "axios";

export const theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc";
export const theMDBURL = "https://api.themoviedb.org/3/";
export const lang = "&language=en-US";

let cache : {[key:string]:any} = {};

app.get('/genres', function(req, res) {
  var queryStr = theMDBURL + "genre/movie/list?" + theMDBKey + lang;
  if (cache[queryStr]) {
    res.send(cache[queryStr]);
  } else {
    axios.get(queryStr).then(
      (response) => {
        res.send(response.data);
        cache[queryStr] = response.data;
     }
    );
  }
});

app.get("/getGenre", function(req, res) {
  var contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false";
  if (req.query.genreID) {
    contentStr += "&with_genres=" + req.query.genreID;
  }
  if (req.query.pageNum) {
    contentStr += "&page=" + req.query.pageNum;
  }
  var queryStr = theMDBURL + "discover/movie?" + theMDBKey + contentStr;
  if (cache[queryStr]) {
    res.send(cache[queryStr]);
  } 
  else {
    axios.get(queryStr).then(
        (response) => {
          res.send(response.data);
          cache[queryStr] = response.data;
        }
    ); 
  }
});

app.get("/getMovie", function(req, res) {
  var queryStr = theMDBURL + "movie/" + req.query.movieID + "?" + theMDBKey + lang;
  if (cache[queryStr]) {
    res.send(cache[queryStr]);
  } 
  else {
    axios.get(queryStr).then(
      (response) => {
         res.send(response.data);
         cache[queryStr] = response.data;
      }
    )
  }
});

http.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

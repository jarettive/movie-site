import { http, app } from "./app";
import {con} from "./db";
import axios from "axios";

export const theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc";
export const theMDBURL = "https://api.themoviedb.org/3/";
export const lang = "&language=en-US";

app.get('/genres', function(req, res) {
  axios.get(theMDBURL + "genre/movie/list?" + theMDBKey + lang).then(
    (response) => {
      res.send(response.data);
   }
  )
});

app.get("/getGenre", function(req, res) {
  const contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_genres=" + req.query.genreID;
  axios.get(theMDBURL + "discover/movie?" + theMDBKey + contentStr).then(
      (response) => {
        res.send(response.data);
      }
  );  
});

app.get("/getPopular", function(req, res) {
  const contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1"
  axios.get(theMDBURL + "discover/movie?" + theMDBKey + contentStr).then(
    (response) => {
      res.send(response.data);
    }
  );
});

app.get("/getMovie", function(req, res) {
  axios.get(theMDBURL + "movie/" + req.query.movieID + "?" + theMDBKey + lang).then(
    (response) => {
       res.send(response.data);
    }
  )
});

http.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

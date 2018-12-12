import axios from "axios";
import * as Main from "./MainPage";

class UserFilters implements observable {
    observers:observer[] = [];
    private filters:any[] = [];
    notifyObservers(event:string) {
        this.observers.forEach(element => {
            element.notified(this, event);
        });
    }
    setList(list:any) {
        this.filters = list;
        this.notifyObservers("filtersSet");
    }
    getFilters = () => {
        return this.filters;
    }
    changeFilter(name:string, val:any) {
        var filt = this.filters.find((filter:any)=>{
            return filter.name == name;
        });
        filt.userPref = val;
        this.notifyObservers("filterChanged");
    }
}

export const userFilters = new UserFilters();

export function shuffleArray(OGarray:any) {
    var array = OGarray.slice();
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export function unimplemented() {
    alert("This feature is unfinished but coming soon!");
}

let lastGenre = "";

export function getGenre(Genre:string, pageNum:number = 1, add:boolean = false, callBack:Function = null) {
    var genre = Genre;
    if (genre == null) {
        genre = lastGenre;
    }
    lastGenre = genre;
    genre = (genre.toLowerCase() === "musical") ? "Music" : genre;
    genre = (genre.toLowerCase() === "sci-fi") ? "Science Fiction" : genre;
    Main.movieList.setGenre(genre);
    axios.get("getGenre", 
    {
        params: {
          genreID: Main.theMDBGenreMap[genre],
          pageNum: pageNum
        }
    }
    ).then(
        (response) => {
            if (add) {
                Main.movieList.addMovies(response.data.results);
            } else {
                Main.movieList.setMovies(response.data.results);
            }
            if (callBack) {
                callBack();
            }
        }
    ); 
}

export interface observable {observers: observer[], notifyObservers:Function};
export interface observer {observe:Function, notified:Function}
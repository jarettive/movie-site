import * as React from "react";
import axios from "axios";
import * as Movies from "./movieCell";
import {TopHeader} from "./TopHeader";
import {SecondHeader} from "./SecondHeader";
import {observable, observer} from "./Utilities";
import { array } from "prop-types";

export const theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc"
export const theMDBURL = "https://api.themoviedb.org/3/";
export const lang = "&language=en-US";
export const img300_450_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

export const theMDBGenreMap:{[key: string]: string} = {}
export const popularGenres : string[] = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "More"];
export const otherGenres : string[] = ["Sci-fi", "Animation", "Musical", "Documentary"];

export class CurrMovieList implements observable {
    name = "CurrMovieList";
    observers: observer[] = [];

    private movies: any[] = [];
    private currMovie : any;
    setMovies = (movies:any[]) => {
        this.movies = movies;
        this.notifyObservers("listChanged");
    }

    setCurrMovie = (movieID : string) => {
        if (movieID == "") {
            this.notifyObservers("movieUnset");
            return;
        }
        this.currMovie = this.movies.find((element:any) =>{
            return element.id == movieID;
        });
        this.notifyObservers("movieChanged");
    }

    getMovies = () => {
        return this.movies;
    }

    notifyObservers(event:string) {
        this.observers.forEach(element => {
            element.notified(this, event);
        });
    }
}

export const movieList = new CurrMovieList();

class MovieGrid extends React.Component implements observer {
    mov : number[] = [];
    readonly state = {movies: this.mov, shown: true};
    observe(ob:observable) {
        ob.observers.push(this);
    }
    notified(observable:any, event:string) {
        if (event == "listChanged") {
            observable as CurrMovieList;
            this.setState({movies:observable.getMovies()})
        }
        if (event == "movieChanged") {
            this.setState({shown: false});
        }
        if (event === "movieUnset") {
            this.setState({shown: true});
        }
    }
    componentWillMount() {
        this.observe(movieList);
        axios.get(theMDBURL + "genre/movie/list?" + theMDBKey + lang).then(
            (response) => {
                interface genreElement {id:string, name:string};
                response.data.genres.forEach((genre:genreElement) => {
                    theMDBGenreMap[genre.name] = genre.id;
                });
            }
        )
    }
    render() {
        let row1Movies : any[] = [];
        let row2Movies : any[] = [];
        if (this.state.movies && this.state.movies.length >=10) {
            row1Movies = this.state.movies.slice(0, 5);
            row2Movies = this.state.movies.slice(5, 10);
        }
        return (
            <div id="movieGrid" className={this.state.shown ? "shown" : "hidden"}>
            {
                <>
                <Movies.MovieRow rowMovies={row1Movies}></Movies.MovieRow>
                <Movies.MovieRow rowMovies={row2Movies}></Movies.MovieRow>
                </>
            }
            </div>
        )
       
    }
}

class MainBody extends React.Component {
    render() {
        return (
        <div id="mainBody">
          <MovieGrid/>
          <SoloMovieDisplay/>
        </div>
        );
    }
}

class SoloMovieDisplay extends React.Component implements observer {
    readonly state = {shown: false};
    observe(ob:observable) {
        ob.observers.push(this);
    }
    notified(observable:any, event:string) {
        if (event == "movieChanged") {
            this.setState({shown: true});
        }
        if (event === "movieUnset") {
            this.setState({shown: false});
        }
    }
    componentWillMount() {
        this.observe(movieList);
    }
    exit() {
        console.log("exiting");
        movieList.setCurrMovie("")
    }
    render() {
        return (
            <div id="soloMovieDisplay" className={this.state.shown ? "shown" : "hidden"}>
                <div onClick={this.exit}>sldkfjslkdfj</div>
            </div>
        )
    }
}

export class MainPage extends React.Component {
    componentWillMount() {
        const contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1"
        axios.get(theMDBURL + "discover/movie?" + theMDBKey + contentStr).then(
        (response) => {
            movieList.setMovies(response.data.results);
        }
        );
    }
    render() {
        return (
            <>
            <TopHeader/>
            <SecondHeader/>
            <MainBody />
            </>              
        );
    }
}

export class SigninPopup extends React.Component<{closePopup:Function}> {
    closePopup = () => {
        this.props.closePopup();
    }
    handleInner = (event:React.MouseEvent) => {
        event.stopPropagation();
    }
    render() {
        return (
        <div id="signinPopup"  onClick={this.closePopup} className="popup">
            <div className="popup_inner" onClick={this.handleInner}>
            </div>
        </div>
        )
    }
}
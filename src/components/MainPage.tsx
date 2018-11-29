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
    setMovies = (movies:any[]) => {
        this.movies = movies;
        this.notifyObservers();
    }

    getMovies = () => {
        return this.movies;
    }

    notifyObservers() {
        this.observers.forEach(element => {
            element.notified(this);
        });
    }
}

export let movieList = new CurrMovieList();

class MainBody extends React.Component implements observer {
    // readonly state = {mov : null};
    mov : number[] = [];
    readonly state = {movies: this.mov};
    observe(ob:observable) {
        ob.observers.push(this);
    }
    notified(observable:any) {
        if (observable instanceof CurrMovieList) {
            observable as CurrMovieList;
            this.setState({movies:observable.getMovies()})
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
        <div id="mainBody">
        {
            <>
            <Movies.MovieRow rowMovies={row1Movies}></Movies.MovieRow>
            <Movies.MovieRow rowMovies={row2Movies}></Movies.MovieRow>
            </>
        }
        </div>
        );
    }
}

export class MainPage extends React.Component {
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
import * as React from "react";
import axios from "axios";
import * as Movies from "./movieCell";
import {TopHeader} from "./TopHeader";
import {SecondHeader} from "./SecondHeader";
import {observable, observer} from "./Utilities";
import {SoloMovieDisplay} from "./SoloDisplay";

export const theMDBKey = "api_key=29d987bf9cd230bfccd9b7ca74c6a3bc"
export const theMDBURL = "https://api.themoviedb.org/3/";
export const lang = "&language=en-US";
export const img300_450_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";
export const img600_900_url = "https://image.tmdb.org/t/p/w600_and_h900_bestv2";

export const theMDBGenreMap:{[key: string]: string} = {}
export const popularGenres : string[] = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "More"];
export const otherGenres : string[] = ["Sci-fi", "Animation", "Musical", "Documentary"];

const movieCount = 6;

class MainBus implements observable {
    observers: observer[] = [];
    notifyObservers = (event:string)=>{
        this.observers.forEach(element => {
            element.notified(this, event);
        });
    }
}

export const mainBus = new MainBus();

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
        this.currMovie = this.movies.find((element:any) =>{
            return element.id == movieID;
        });
        this.notifyObservers("movieChanged");
    }
    getcurrMovie() {
        return this.currMovie;
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

export enum mainview {
    grid, solo, filters, last
} 

export interface subPageItem {show:boolean, callBack:Function};

class MainBody extends React.Component implements observer {
    
    readonly state = {showingChild:mainview.grid, last:mainview.grid};
    
    movies: any[] = [];

    childCallback = (child:mainview) => {
        if (child == mainview.last) {
            child = this.state.last;
        }
        this.setState({showingChild:child, last:this.state.showingChild});
    }
    
    componentWillMount() {
        this.observe(movieList);
        this.observe(mainBus);
        axios.get(theMDBURL + "genre/movie/list?" + theMDBKey + lang).then(
            (response) => {
                interface genreElement {id:string, name:string};
                response.data.genres.forEach((genre:genreElement) => {
                    theMDBGenreMap[genre.name] = genre.id;
                });
            }
        )
    }

    observe(ob:observable) {
        ob.observers.push(this);
    }
    notified(observable:any, event:string) {
        if (event == "movieChanged") {
            this.setState({showingChild:mainview.solo, last:this.state.showingChild});
        }
        if (event == "listChanged") {
            this.movies = movieList.getMovies();
            this.setState({showingChild:mainview.grid, last:this.state.showingChild});
        }
        if (event == "showFilters") {
            this.setState({showingChild:mainview.filters, last:this.state.showingChild});
        }
    }

    render() {
        return (
        <div id="mainBody">
          <MovieGrid item={{callBack:this.childCallback, show: this.state.showingChild == mainview.grid}} movies={this.movies}/>
          <SoloMovieDisplay item={{callBack:this.childCallback, show: this.state.showingChild == mainview.solo}} movie={movieList.getcurrMovie()}/>
          <FilterPage item={{callBack:this.childCallback, show: this.state.showingChild == mainview.filters}}/>
        </div>
        );
    }
}

class FilterPage extends React.Component<{item:subPageItem}>{
    render() {
        return (
            <div id="filterPage" onClick={()=>{this.props.item.callBack(mainview.last)}} className={this.props.item.show ? "shown" : "hidden"}>
            </div>
        )
    }
}

class MovieGrid extends React.Component<{item:subPageItem, movies:any[]}> {
    mov : number[] = [];

    render() {
        let row1Movies : any[] = [];
        let row2Movies : any[] = [];
        if (this.props.movies && this.props.movies.length >=10) {
            row1Movies = this.props.movies.slice(0, movieCount);
            row2Movies = this.props.movies.slice(movieCount, movieCount*2);
        }
        return (
            <div id="movieGrid" className={this.props.item.show ? "shown" : "hidden"}>
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
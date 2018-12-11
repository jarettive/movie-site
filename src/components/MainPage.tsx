import * as React from "react";
import axios from "axios";
import {MovieGrid} from "./MovieGrid";
import {TopHeader} from "./TopHeader";
import {SecondHeader} from "./SecondHeader";
import {observable, observer} from "./Utilities";
import {SoloMovieDisplay} from "./SoloDisplay";
import {MaybeListComponent} from "./MaybeList";

export const img300_450_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";
export const img600_900_url = "https://image.tmdb.org/t/p/w600_and_h900_bestv2";

export const theMDBGenreMap:{[key: string]: string} = {}
export const popularGenres : string[] = ["All", "Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "More"];
export const otherGenres : string[] = ["Sci-fi", "Animation", "Musical", "Documentary"];

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
    private currGenre : string = "";
    unFilteredCount : number = 0;
    filters: any[] = [];
    filterList = (filters:any[]) => {
        var toFilter = [];
        var toUnfilter = [];
        var count = 0;
        this.filters.push("zoo Weee");
        this.movies.forEach((movie)=>{
            movie.filtered = (count % 2 == 0);
            count++;
        });
        this.notifyObservers("filtersChanged");
    }

    setMovies = (movies:any[]) => {
        this.movies = movies;
        this.notifyObservers("listChanged");
    }

    getGenre = () => {
        return this.currGenre;
    }

    addMovies = (movs:any[]) => {
        this.movies = this.movies.concat(movs);
        this.notifyObservers("listChanged");
    }

    setGenre = (genre:string) => {
        this.currGenre = genre;
        this.notifyObservers("genreChanged");
    }

    setCurrMovie = (movieID : string) => {
        this.currMovie = this.movies.find((element:any) =>{
            return element.id == movieID;
        });
        if (!this.currMovie.imdb_id) {
            axios.get("getMovie", { params: {movieID:movieID}}).then(
                (response) => {
                   this.currMovie = response.data;
                   this.notifyObservers("movieChanged");
                }
            )
        }
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
    
    readonly state = {showingChild:mainview.grid, last:mainview.last, changedFilter:false};
    
    movies: any[] = [];
    childCallback = (child:mainview) => {
        if (child == mainview.last) {
            child = this.state.last;
        }
        var last = (child == this.state.showingChild) ? this.state.last : this.state.showingChild;
        this.setState({showingChild:child, last:last});
    }
    
    componentWillMount() {
        this.observe(movieList);
        this.observe(mainBus);

        axios.get("/genres").then(
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
        var show = mainview.grid;
        var filterChanged = false;
        if (event == "movieChanged") {
            show = mainview.solo;
        }
        if (event == "listChanged") {
            this.movies = movieList.getMovies();
            show = mainview.grid;
        }
        if (event == "filtersChanged") {
            this.movies = movieList.getMovies();
            filterChanged = true;
        }
        if (event == "showFilters") {
            show = mainview.filters;
        }

        var last = (show == this.state.showingChild) ? this.state.last : this.state.showingChild;
        this.setState({showingChild:show, last:last, changedFilter:filterChanged});
    }

    render() {
        var result = (
        <div id="mainBody">
          <MovieGrid item={{callBack:this.childCallback, show: this.state.showingChild == mainview.grid}} movies={this.movies} changedFilter={this.state.changedFilter} genre={movieList.getGenre()}/>
          <SoloMovieDisplay item={{callBack:this.childCallback, show: this.state.showingChild == mainview.solo}} movie={movieList.getcurrMovie()}/>
          <FilterPage item={{callBack:this.childCallback, show: this.state.showingChild == mainview.filters}}/>
        </div>
        );
        return result;
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

export class MainPage extends React.Component {
    componentWillMount() {
        axios.get("getGenre").then(
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
            <MaybeListComponent/>
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
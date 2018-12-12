import * as React from "react";
import axios from "axios";
import {MovieGrid} from "./MovieGrid";
import {TopHeader} from "./TopHeader";
import {SecondHeader} from "./SecondHeader";
import {observable, observer, userFilters} from "./Utilities";
import {SoloMovieDisplay} from "./SoloDisplay";
import {MaybeListComponent} from "./MaybeList";
import {FilterPage} from "./FilterPage";
import * as $ from "jquery";

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

export class CurrMovieList implements observable, observer {
    name = "CurrMovieList";
    observers: observer[] = [];

    private movies: any[] = [];
    private currMovie : any;
    private currGenre : string = "";
    unFilteredCount : number = 0;

    observe(ob:observable) {
        ob.observers.push(this);
    }
    notified(observable:any, event:string) {
        this.filterList(this.movies);
        this.notifyObservers("filtersChanged");
    }

    filterList = (list:any[]) => {
        var filters = userFilters.getFilters();
        if (filters.length > 0) {
            for (var idx in list) {
                var movie = list[idx];
                movie.filtered = true;
                movie.myFilterData.view_service.forEach((service:string)=>{
                    filters.forEach((filter)=> {
                        var pref = filter.userPref || filter.default;
                        if (filter.name == service && pref == "yes") {
                            movie.filtered = false;
                        }
                    })
                });
            }
        }
    }

    setMovies = (movies:any[]) => {
        this.movies = movies;
        this.filterList(this.movies);
        this.notifyObservers("listChanged");
    }

    getGenre = () => {
        return this.currGenre;
    }

    addMovies = (movs:any[]) => {
        this.filterList(movs);
        this.movies = this.movies.concat(movs);
        this.notifyObservers("listChanged");
    }

    setGenre = (genre:string) => {
        if (this.currGenre != genre){
            this.currGenre = genre;
            this.notifyObservers("genreChanged");
        }
    }

    setCurrMovie = (movieID : string) => {
        this.currMovie = this.movies.find((element:any) =>{
            return element.id == movieID;
        });
        if (!this.currMovie || !this.currMovie.imdb_id) {
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
movieList.observe(userFilters);

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
        var show = this.state.showingChild;
        var filterChanged = false;
        if (event == "movieChanged") {
            show = mainview.solo;
        }
        if (event == "genreChanged") {
            show = mainview.grid;
            $("#preferenceHeader").css({visibility:""});
        }
        if (event == "listChanged") {
            this.movies = movieList.getMovies();
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
import * as React from "react";
import axios from "axios";
import {movieList, CurrMovieList, subPageItem,  img300_450_url} from "./MainPage";
import {unimplemented} from "./Utilities";

const rowSize = 5;

const movieCount = 6;

export class MovieGrid extends React.Component<{item:subPageItem, movies:any[]}> {
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
                <MovieRow rowMovies={row1Movies}/>
                <MovieRow rowMovies={row2Movies}/>
                </>
            }
            <i className="goRight fas fa-caret-right"onClick={unimplemented}/>
            <i className="goLeft fas fa-caret-left" onClick={unimplemented}/>
            </div>
        )
       
    }
}

export class MovieRow extends React.Component<{rowMovies:any[]}> {
    render() {
        let cells = [];
        if (this.props.rowMovies.length > 0 ) {
            cells = this.props.rowMovies;
            cells.forEach((cell:any) => {
                cell.img_path = img300_450_url + cell.poster_path;
            });
        }
        return <div className="movieRow">
        {
            cells.map((element:any) => {
                return <MovieCell mov={element}/>
            })
        }
        </div>
    }
}

interface movieCellInfo {title:string, img_path:string, id:string}

export class MovieCell extends React.Component<{mov:movieCellInfo}> {
    viewMovie = () => {
        movieList.setCurrMovie(this.props.mov.id)
    }
    render() {
        return (
            <div className="movieCell">
                <img onClick={this.viewMovie} src={this.props.mov.img_path}></img>
                <div className="movieTitle">{this.props.mov.title}</div>
            </div>
        )
    }
}
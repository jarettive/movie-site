import * as React from "react";
import axios from "axios";
import {movieList, CurrMovieList, img300_450_url} from "./MainPage";
import {observer, observable} from "./Utilities";
import {unimplemented} from "./Utilities";

const rowSize = 5;

export class MovieRow extends React.Component<{rowMovies:any[]}> {
    render() {
        let cells = [];
        if (this.props.rowMovies.length > 0 ) {
            cells = this.props.rowMovies;
            cells.forEach((cell:movieCellInfo) => {
                cell.poster_path = img300_450_url + cell.poster_path;
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

interface movieCellInfo {title:string, poster_path:string}

export class MovieCell extends React.Component<{mov:movieCellInfo}> {
    render() {
        return (
            <div className="movieCell">
                <img onClick={unimplemented} src={this.props.mov.poster_path}></img>
                <div className="movieTitle">{this.props.mov.title}</div>
            </div>
        )
    }
}
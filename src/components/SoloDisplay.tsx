
import {subPageItem, mainview, img600_900_url, img300_450_url} from "./MainPage";
import * as React from "react";

export class SoloMovieDisplay extends React.Component<{item:subPageItem, movie:any}> {
    render() {
        console.dir(this.props.movie);
        return (
            <div id="soloMovieDisplay" className={this.props.item.show ? "shown" : "hidden"}>
                <i id="soloClose" className="far fa-times-circle" onClick={()=>{this.props.item.callBack(mainview.last)}}></i>
                <img src={this.props.movie && img600_900_url+this.props.movie.poster_path}></img>
            </div>
        )
    }
}
import {subPageItem, mainview, img600_900_url, img300_450_url} from "./MainPage";
import * as React from "react";

export class SoloMovieDisplay extends React.Component<{item:subPageItem, movie:any}> {
    boxRef: React.RefObject<HTMLDivElement>;
    constructor(props:{item:subPageItem, movie:any}) {
        super(props);
        this.boxRef = React.createRef();
    }
    componentDidUpdate= ()=> {
        if (this.props.item.show) {
            this.boxRef.current.scrollIntoView({block:"start", behavior:"smooth"});
        }
    }
    render() {
        var time = (this.props.movie) ? this.props.movie.runtime : 0;
        return (
            <div id="soloMovieDisplay" className={this.props.item.show ? "shown" : "hidden"} ref={this.boxRef}>
                <i id="soloClose" className="far fa-times-circle" onClick={()=>{this.props.item.callBack(mainview.last)}}></i>
                <div className="left">
                    <img src={this.props.movie && img600_900_url+this.props.movie.poster_path}></img>
                    <div id="tagLine"></div>
                </div>
                <div className="right">
                {this.props.movie &&
                <>
                    <div id="soloTitle">{this.props.movie.title}</div>
                    <div id="overview">{this.props.movie.overview}</div>
                    <div id="runtime">{Math.floor(time/60) + " hours " + time%60 + " minutes"}</div> 
                </>
                }
                </div>
            </div>
        )
    }
}
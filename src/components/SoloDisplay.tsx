import {subPageItem, mainview, img600_900_url, img300_450_url} from "./MainPage";
import * as React from "react";
import {maybeList} from "./MaybeList";

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
        var hours = Math.floor(time/60);
        var viewServices = (this.props.movie && this.props.movie.myFilterData.view_service) ? this.props.movie.myFilterData.view_service : [];
        var services = ["Netflix", "Hulu", "Redbox", "Amazon", "Starz", "HBO"];
        return (
            <div id="soloMovieOuter" onClick={()=>{this.props.item.callBack(mainview.last)}}>
                <div id="soloMovieDisplay" onClick={(event)=>{event.stopPropagation()}} className={this.props.item.show ? "shown" : "hidden"} ref={this.boxRef}>
                    <i id="soloClose" className="far fa-times-circle" onClick={()=>{this.props.item.callBack(mainview.last)}}></i>
                    <div className="left">
                        <img src={this.props.movie && img600_900_url+this.props.movie.poster_path}></img>
                        {this.props.movie && this.props.movie.tagline
                        && <div id="tagLine">"{this.props.movie.tagline}"</div>
                        }
                    </div>
                    <div className="right">
                    {this.props.movie &&
                    <>
                        <div id="soloTitle">{this.props.movie.title}</div>
                        <div id="overview">{this.props.movie.overview}</div>
                        <div id="runtime">Runtime: {(hours > 0) && hours + " hour" + ((hours>1) ? "s " : " ") + time%60 + " minutes"}</div> 
                        <div id="budget">Budget: ${this.props.movie.budget && this.props.movie.budget.toLocaleString()}</div>
                        <div id="services">
                            <div>Available on:</div>
                            {
                                services.map((service:string)=>{
                                    var searchTerm = (service =="Amazon") ? "Amazon Video" : service;
                                    var searchTerm = (service =="HBO") ? "HBO Now" : service;
                                    return (
                                        <div className={"service" + ((viewServices.indexOf(searchTerm)!=-1) ? "" : " unavailable")}>
                                            <img src={"images/" + service + ".jpg"}></img>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div id="maybeButton" onClick={()=>{maybeList.add(this.props.movie);}}>Add to Maybe List</div>
                    </>
                    }
                    </div>
                </div>
            </div>
        )
    }
}
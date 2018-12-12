import { movieList, img300_450_url } from "./MainPage";
import * as React from "react";
import {observable, observer} from "./Utilities";

class MaybeList implements observable {
    private list :any[] = [];
    observers: observer[] = [];

    add = (movie:any) => {
        var found = this.list.find((mov)=>{
            return mov.id == movie.id;
        });
        if (this.list.length < 8 && !found){
            this.list.push(movie);
            this.notifyObservers("maybeListChanged");
        }
    }

    remove = (movieID:string) => {
        this.list = this.list.filter((movie)=>{
            return (movie.id != movieID);
        });
        this.notifyObservers("maybeListChanged");
    }

    getList = () => {
        return this.list;
    }

    notifyObservers(event:string) {
        this.observers.forEach(element => {
            element.notified(this, event);
        });
    }
}

export var maybeList = new MaybeList();

interface maybeState {hover:boolean, list:[], chosenIdx:number, trueChosen:number}
export class MaybeListComponent extends React.Component implements observer{
    readonly state:maybeState = {hover:false, list:[], chosenIdx:-1, trueChosen:-1};
    
    ogListSize:number = 0;
    observe(ob:observable) {
        ob.observers.push(this);
    }

    notified(observable:any, event:string) {
        if (event == "maybeListChanged") {
            this.setState({list:maybeList.getList()});
        }
    }

    componentWillMount() {
        this.observe(maybeList);
    }

    onMouseEnter = () => {
        this.setState({hover:true});
        this.ogListSize = this.state.list.length;
    }

    onMouseLeave = () => {
        if (this.state.chosenIdx == -1){
            this.setState({hover:false, trueChosen:-1});
        }
    }

    muvieChoose = () => {
        var func = () => {
            timeToNextSwitch += (timeToNextSwitch * (Math.random()/3))
            this.setState({chosenIdx:(this.state.chosenIdx+1)%this.state.list.length});
            if (timeToNextSwitch < 800) {
                setTimeout(func, timeToNextSwitch);
            } else {
                this.setState({trueChosen:this.state.chosenIdx, chosenIdx:-1});
            }
        }
        if (this.state.chosenIdx == -1){
            var timeToNextSwitch = 10;
            var start = Math.floor(Math.random()*this.state.list.length);
            this.setState({chosenIdx:start})
            func();
        }
    }

    render() {
        var listCount = this.state.list.length;
        var hover = (this.state.list.length == 0) ? false: this.state.hover;
        var style = (hover) ? {width:(2 + this.ogListSize * 12) + "vw", height:"46vh"} : (listCount < 1) ? {display:"none"} : {};
        return (
            <div id="maybeList" style={style} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <div id="maybeContainer">
            {
                this.state.list.map((element, idx)=>{
                    return <MaybeMovieComp key={idx} idx={idx} numInList={listCount} movie={element} choosing={idx==this.state.chosenIdx} trueChosen={idx==this.state.trueChosen}/>
                })
            }
            </div>
                <div id="maybeLabel">Maybe List</div>
                { listCount > 1 &&
                <i className="muvieChoose fas fa-dice" onClick={this.muvieChoose}>
                <div id="muvieChooseHelper">Choose for me!</div>
                </i>
                }

            </div>
        );
    }
}

class MaybeMovieComp extends React.Component<{movie:any, idx:number, numInList:number, choosing:boolean, trueChosen:boolean}> {
    viewMovie = () => {
        movieList.setCurrMovie(this.props.movie.id)
    }
    remove = (event:any) => {
        event.stopPropagation();
        maybeList.remove(this.props.movie.id);
    }
    render() {
        var imgPath = img300_450_url + this.props.movie.poster_path;
        var classes = "maybeMovie" + ((this.props.choosing) ? " choosing" : "") + ((this.props.trueChosen) ? " trueChosen" : "");
        var style = {width: 100/this.props.numInList + "%", left: (this.props.idx*100/this.props.numInList) + "%"};
        return (
            <div className={classes} style={style}>
                <img onClick={this.viewMovie} src={imgPath}/>
                <i onClick={this.remove} className="remove fas fa-times-circle"></i>
                <i className="chooseArrow fas fa-caret-up"></i>
                <i className="crown fas fa-crown"></i>
                <div className="movieTitle">{this.props.movie.title}</div>
            </div>
        );
    }
}
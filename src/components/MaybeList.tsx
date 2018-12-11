import { movieList } from "./MainPage";
import * as React from "react";
import {observable, observer} from "./Utilities";

class MaybeList implements observable {
    private list :any[] = [];
    observers: observer[] = [];

    add = (movie:any) => {
        if (this.list.length < 8){
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

interface maybeState {hover:boolean, list:[]}
export class MaybeListComponent extends React.Component implements observer{
    readonly state:maybeState = {hover:false, list:[]};
    
    observe(ob:observable) {
        ob.observers.push(this);
    }

    notified(observable:any, event:string) {
        if (event == "maybeListChanged") {
            this.setState({list:maybeList.getList(), hover:false});
        }
    }

    componentWillMount() {
        this.observe(maybeList);
    }

    onMouseEnter = () => {
        this.setState({hover:true});
    }

    onMouseLeave = () => {
        this.setState({hover:false});
    }

    render() {
        var listCount = this.state.list.length;
        var hover = (this.state.list.length == 0) ? false: this.state.hover;
        var style = (hover) ? {width:(2 + listCount * 12) + "vw"} : (listCount < 1) ? {display:"none"} : {};
        return (
            <div id="maybeList" style={style} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <div id="maybeContainer">
            {
                this.state.list.map((element, idx)=>{
                    return <MaybeMovieComp key={idx} idx={idx} numInList={listCount} movie={element}/>
                })
            }
            </div>
            <div id="maybeBottom">
                <div id="maybeLabel">Maybe List</div>
                {
                listCount > 1 &&<i className="muvieChoose fas fa-dice"></i>
                }
            </div>
            </div>
        );
    }
}

class MaybeMovieComp extends React.Component<{movie:any, idx:number, numInList:number}> {
    viewMovie = () => {

    }
    remove = () => {
        maybeList.remove(this.props.movie.id);
    }
    render() {
        var style = {width: 100/this.props.numInList + "%", left: (this.props.idx*100/this.props.numInList) + "%"};
        return (
            <div className="maybeMovie" style={style} onClick={this.viewMovie}>
                <img src={this.props.movie.img_path}/>
                <i onClick={this.remove} className="remove fas fa-times-circle"></i>
                <div className="movieTitle">{this.props.movie.title}</div>
            </div>
        );
    }
}
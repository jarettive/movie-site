import * as React from "react";
import {movieList, CurrMovieList, subPageItem,  img300_450_url} from "./MainPage";
import {unimplemented, getGenre} from "./Utilities";
import * as $ from "jquery";


export const moviesPerPage = 14;

class MoviePage extends React.Component<{movies:any[]}> {
    render() {
        let row1Movies : any[] = [];
        let row2Movies : any[] = [];
        if (this.props.movies && this.props.movies.length >=moviesPerPage) {
            row1Movies = this.props.movies.slice(0, moviesPerPage/2);
            row2Movies = this.props.movies.slice(moviesPerPage/2, moviesPerPage);
        }
        
        return (
            <div className="moviePage">
                <>
                <MovieRow rowMovies={row1Movies}/>
                <MovieRow rowMovies={row2Movies}/>
                </>
            </div>
        )
    }
}

export class MovieGrid extends React.Component<{item:subPageItem, movies:any[], genre:string}> {
    pages: any[] = [];
    readonly state = {pageNumber:0};
    constructor(props:{item:subPageItem, movies:any[], genre:string}) {
        super(props);
    }
    mov : number[] = [];
    leftArrowRef: React.RefObject<HTMLDivElement>;
    componentWillMount = () => {
        this.turnPage(true);
        this.leftArrowRef = React.createRef();
    }

    turnPage = (right:boolean = false) => {
        if (right == false && this.state.pageNumber == 1) {
            return;
        }
        this.setState({pageNumber: this.state.pageNumber += (right ? 1:-1)})
        this.addMoreMovies();
        $("#moviePages").animate({left: ((this.state.pageNumber-1)*-100)+ "%"}, 200);
    }

    addMoreMovies = () => {
        if ((this.state.pageNumber+1) * moviesPerPage > this.props.movies.length) {
            getGenre(null, this.state.pageNumber+1, true);
        } 
    }
    componentWillReceiveProps = (props:any) => {
        var pageCount = Math.floor(props.movies.length/moviesPerPage);
        this.pages = [];
        for (var i = 0; i < pageCount; i++) {
            var page = props.movies.slice(i*moviesPerPage, (i+1)*moviesPerPage);
            this.pages[i] = page;
        }
        if (props.genre != this.props.genre) {
            this.setState({pageNumber:1});
            this.addMoreMovies();
        }
    }

    keyPress(event:React.KeyboardEvent<HTMLDivElement>) {
        if (event.keyCode == 37) {
            this.turnPage();
        } else if (event.keyCode == 39) {
            this.turnPage(true);
        }
    }

    render() {
        var leftArrClass = "goLeft fas fa-caret-left " + ((this.state.pageNumber ==1) ? "hidden" : "shown");
        return (
            <div id="movieGrid" tabIndex={0} className={this.props.item.show ? "shown" : "hidden"} onKeyDown={(event)=>{this.keyPress(event)}}>
                <div id="moviePages" style={{left:  ((this.state.pageNumber-1)*-100)+ "%"}}>
                {
                    this.pages.map((page:any, idx:any) => {
                        return <MoviePage key={idx} movies={page}/>
                    })
                }
                </div>
            <i className="goRight fas fa-caret-right"onClick={()=>{this.turnPage(true)}}/>
            <i className={leftArrClass} onClick={()=>{this.turnPage()}}/>
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
            cells.map((element:any, index:number) => {
                return <MovieCell key={index} mov={element}/>
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
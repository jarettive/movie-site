import * as React from "react";
import {movieList, CurrMovieList, subPageItem,  img300_450_url} from "./MainPage";
import {unimplemented, getGenre} from "./Utilities";
import * as $ from "jquery";
import {maybeList} from "./MaybeList";


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

interface GridInfo {item:subPageItem, movies:any[], genre:string, changedFilter:boolean}
export class MovieGrid extends React.Component<GridInfo> {
    pages: any[] = [];
    readonly state = {pageNumber:0};
    constructor(props:GridInfo) {
        super(props);
    }
    mov : number[] = [];
    leftArrowRef: React.RefObject<HTMLDivElement>;
    unfilteredCnt:number = 0;
    retrievedPages = 1;

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
        if ((this.state.pageNumber+1) * moviesPerPage > this.unfilteredCnt) {
            this.retrievedPages++;
            getGenre(null, this.retrievedPages, true);
        } 
    }

    componentWillReceiveProps = (props:any) => {
        this.pages = [];
        var j = 0;
        var pageNum = 0;
        this.unfilteredCnt = 0;
        while (j < props.movies.length) {
            var unfilteredCnt = 0;
            var page = [];
            while (unfilteredCnt < moviesPerPage && j < props.movies.length) {
                var movie = props.movies[j];
                if (!movie.filtered) {
                    unfilteredCnt++;
                    page.push(movie);
                } 
                j++;
            }
            this.unfilteredCnt += unfilteredCnt;
            this.pages[pageNum] = page;
            pageNum++;
        }
        if (props.genre != this.props.genre || props.changedFilter) {
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
        var leftArrClass = "moveArrow goLeft fas fa-caret-left " + ((this.state.pageNumber ==1) ? "hidden" : "shown");
        return (
            <div id="movieGrid" tabIndex={0} className={this.props.item.show ? "shown" : "hidden"} onKeyDown={(event)=>{this.keyPress(event)}}>
                <div id="moviePages" style={{left:  ((this.state.pageNumber-1)*-100)+ "%"}}>
                {
                    this.pages.map((page:any, idx:any) => {
                        return <MoviePage key={idx} movies={page}/>
                    })
                }
                </div>
            <i className="moveArrow goRight fas fa-caret-right"onClick={()=>{this.turnPage(true)}}/>
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

interface movieCellInfo {title:string, img_path:string, id:string, filtered:boolean}

export class MovieCell extends React.Component<{mov:movieCellInfo}> {
    addMaybe = () => {
        maybeList.add(this.props.mov);
    }
    viewMovie = () => {
        movieList.setCurrMovie(this.props.mov.id)
    }

    render() {
        var classes = "movieCell " + (this.props.mov.filtered ? "hidden " : "");
        return (
            <div className={classes} >
                <img onClick={this.viewMovie} src={this.props.mov.img_path}/>
                <i onClick={this.addMaybe} className="addMovie fas fa-plus-square"><div className="addMovieHelper">Add to Maybe List</div></i>
                <div className="movieTitle">{this.props.mov.title}</div>
            </div>
        )
    }
}
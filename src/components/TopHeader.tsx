import * as React from "react";
import axios from "axios";
import {SigninPopup, movieList} from "./MainPage";
import {unimplemented} from "./Utilities";
import {debounce} from "lodash";

///search/multi?language=en-US&query=zoo
interface TopState {showText:boolean, potentials:any[]}
export class TopHeader extends React.Component<any, any> {
    readonly state :TopState = {showText:true, potentials:[]}
    constructor(props:any) {
        super(props);
        this.sendSearch = debounce(this.sendSearch, 200);
    }
    search = (event: any) => {
        this.sendSearch(event.target.value);
    }
    sendSearch = (queryStr:string) => {
        axios.get("search", { params: {queryStr:queryStr}}).then(
            (response) => {
                var sorted = response.data.results.sort((el1:any, el2:any) => (el2.popularity - el1.popularity));
                this.setState({potentials:sorted.slice(0, 5)});
            }
        )
    }
    render() {
        return (
            <div id="topHeader">
                <div className="vertCentered">
                    <div id="titleText" onClick={()=>{movieList.filterList(["Hulu"])}}>MUVIE</div>
                    <div id="logoText">find movies for you</div>
                </div>
                <div className="rightCentered">
                    <div id="searchBar"> 
                        {this.state.showText && 
                            <i className="fas fa-search"/>
                        } 
                        <input type="text" 
                            placeholder={this.state.showText == true ?  "Search movies" : ""} 
                            onKeyDown={this.search}
                            onFocus={(inp)=>{ this.setState({showText:false})}}
                            onBlur= {(inp)=>{ this.setState({showText:true})}} />
                    {!this.state.showText && this.state.potentials.length > 0 && 
                    <div id="searchResults">
                        {   
                            this.state.potentials.map((element)=>{
                                return <div className="searchResult" onMouseDown={()=>{console.dir(element);movieList.setCurrMovie(element.id)}}>
                                    {element.title + " (" + element.release_date.substring(0,4) +")"}
                                    </div>
                            })
                        }
                    </div>
                    }
                    </div>
                </div>
            </div>)
    }
}
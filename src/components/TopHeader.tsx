import * as React from "react";
import axios from "axios";
import {SigninPopup} from "./MainPage";
import {unimplemented} from "./Utilities";
class TopSignIn extends React.Component {
    readonly state = {showPopup:false}
    togglePopup = () => {
        // this.setState({showPopup:!this.state.showPopup});
        unimplemented();
    }
    render() {
        return (
            <div id="topSignIn">
                <div onClick={this.togglePopup}>Sign in</div>
                {this.state.showPopup && <SigninPopup closePopup={this.togglePopup.bind(this)}/>}
            </div>
        )
    }
}


///search/multi?language=en-US&query=zoo
export class TopHeader extends React.Component<any, any> {
    readonly state = {showText:true}
    render() {
        return (
            <div id="topHeader">
                <div className="vertCentered">
                    <div id="titleText">MUVIE</div>
                    <div id="logoText">find movies for you</div>
                </div>
                <div className="rightCentered">
                    <div id="searchBar"> 
                        {this.state.showText && 
                            <i className="fas fa-search"/>
                        } 
                        <input type="text" 
                            placeholder={this.state.showText == true ?  "Search movies" : ""} 
                            onChange={unimplemented}
                            onFocus={(inp)=>{ this.setState({showText:false})}}
                            onBlur= {(inp)=>{ this.setState({showText:true})}} />
                    </div>
                </div>
            </div>)
    }
}
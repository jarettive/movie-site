import * as React from "react";
import axios from "axios";
import * as Main from "./MainPage";
import * as Util from "./Utilities";

interface filter {name:string, type:string, question:string};
let filters : filter[] = []

class PrefSignIn extends React.Component {
    readonly state = {showPopup:false}
    togglePopup = () => {
        this.setState({showPopup:!this.state.showPopup});
    }
    render() {
       return <div id="preferenceSignIn">
       <div onClick={this.togglePopup}><u>Sign in</u> to keep preferences</div>
       {this.state.showPopup && <Main.SigninPopup closePopup={this.togglePopup.bind(this)}/>}
       </div>
    }
}

export class SecondHeader extends React.Component {
    render() {
        return (
        <div id="secondHeader">
            <div id="preferenceHeader">
                <div id="questionsBanner">
                <PreferenceBelt/>
                </div>
                <PrefSignIn/>
            </div>
            <div id="genreHeader">
                <div id="genreHeaderInner">
                {
                    Main.popularGenres.map(element => {
                        return <GenreTab key={Main.theMDBGenreMap[element]} val={element}/>
                    })
                }
                </div>
            </div>
        </div>
        );
    }
}

class MoreMenu extends React.Component {
    render() {
        return (
            <div className="genreMenu">
            {
                Main.otherGenres.map((element) => {
                    return (
                        <div>{element}</div>
                    )
                })
            }
            </div>
        )
    }
}

class GenreTab extends React.Component<{val:string}> {
    readonly state = {showPopupMenu:false}
    click = () => {
        const contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_genres=" 
                            + Main.theMDBGenreMap[this.props.val];
        axios.get(Main.theMDBURL + "discover/movie?" + Main.theMDBKey + contentStr).then(
            (response) => {
                Main.movieList.setMovies(response.data.results);
            }
        );
    }
    mouseEnter = () => {
        if (this.props.val == "More"){
            this.setState({showPopupMenu:true})
        }
    }
    mouseLeave = () => {
        if (this.props.val == "More"){
            this.setState({showPopupMenu:false})
        }
    }
    render() {
        return (
        <a className="genreTab"
        onClick={this.click.bind(this)}
        onMouseEnter={this.mouseEnter.bind(this)}
        onMouseLeave={this.mouseLeave}
        >
        {this.props.val}
        {this.state.showPopupMenu && <MoreMenu />}
        </a>)
    }
}

class PreferenceBelt extends React.Component {
    readonly state = {fltrs:filters, leftMarg:0}
    componentWillMount() {
        axios.get("\pref-filters.json").then(
            (response) => {
                filters = response.data;
                Util.shuffleArray(filters);
                this.setState({fltrs:filters})
                this.convey();
            }
        )
    }

    convey = () => {
        setInterval(() => {
            const el = document.getElementById("prefBelt");
            let num = parseInt(el.style.marginLeft);
            let str = (num-1) + "px";
            el.style.marginLeft = str;
          }, 76);
    }

    render() {
        let style = {marginLeft:this.state.leftMarg};
        return (
            <div id="prefBelt" style={style}>
            {
                this.state.fltrs.map((element:filter) => {
                    return <PreferenceQuestion key={element.name} filt={element}/>
                })
            }
            </div>
        )
    }
}

class PreferenceQuestion extends React.Component<{filt:filter}> {
    readonly state = {positive:true};

    constructor(props:any) {
        super(props);
    }
    positive = () => {
        this.setState({positive:true});
    }
    negative = () => {
        this.setState({positive:false});
    }
    render() {
        return (
            <div className="prefQuestion">
            {this.props.filt.question}
                <div className="questionOptions">
                    <span className="affirmative" onClick={this.positive}>
                    {this.state.positive ? <i className="far fa-check-square"></i>: <i className="far fa-square"></i>}
                        <span>Yes</span>
                    </span>
                    <span className="negative" onClick={this.negative}>
                    {!this.state.positive ? <i className="far fa-check-square"></i>: <i className="far fa-square"></i>}
                        <span>No</span>
                    </span>
                </div>
            </div>
        )
    }
}
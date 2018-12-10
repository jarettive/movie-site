import * as React from "react";
import axios from "axios";
import * as Main from "./MainPage";
import * as Util from "./Utilities";
import * as $ from "jquery";

interface filter {name:string, type:string, question:string};
let filters : filter[] = []

class PrefSignIn extends React.Component {
    readonly state = {showPopup:false}
    showFilters = () => {
         Main.mainBus.notifyObservers("showFilters");   
    }
    render() {
       return <div id="preferenceSignIn">
       <div onClick={this.showFilters}><u>View all filters</u></div>
       </div>
    }
}

export class SecondHeader extends React.Component {
    readonly state = {selectedGenre:""}
    genreClicked = (val:string) => {
        this.setState({selectedGenre:val});
    }

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
                        
                        return <GenreTab callback={this.genreClicked} 
                                         chosen={element == this.state.selectedGenre} 
                                         key={Main.theMDBGenreMap[element] || element} 
                                         val={element}/>
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
                        <div key={element} onClick={() =>Util.getGenre(element)}>{element}</div>
                    )
                })
            }
            </div>
        )
    }
}

class GenreTab extends React.Component<{val:string, callback:Function, chosen:boolean}> {
    readonly state = {showPopupMenu:false}
    click = () => {
        if (this.props.val !== "More") {
            Util.getGenre(this.props.val);
            this.props.callback(this.props.val);
        }
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
        var className = "genreTab" + ((this.props.chosen) ? " chosen" : "");
        return (
        <a className={className}
        onClick={this.click.bind(this)}
        onMouseEnter={this.mouseEnter.bind(this)}
        onMouseLeave={this.mouseLeave}
        >
        <div>{this.props.val}</div>
        {this.state.showPopupMenu && <MoreMenu />}
        </a>)
    }
}

class PreferenceBelt extends React.Component {
    readonly state = {fltrs:filters, leftMarg:0}

    index : number = 0;
    changedBetween: boolean = false;
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

    nextQuestion = () => {
        var rect = $(".prefQuestion")[0].getBoundingClientRect();
        this.index += 1;
        var animationTime = 600;
        if (this.index >= this.state.fltrs.length) {
            this.index = 0;
            animationTime = 1;
        }
        var top = -rect.height * this.index;
        $("#prefBelt").animate({marginTop: top + "px"}, animationTime);
    }

    convey = () => {
        const el = document.getElementById("prefBelt");
        setInterval(() => {
            if (!this.changedBetween) {
                this.nextQuestion();
            }
            this.changedBetween = false;
          }, 6500);
    }

    questionAnswered = () => {
        this.nextQuestion();
        this.changedBetween = true;
    }

    render() {
        return (
            <div id="prefBelt" style={{marginTop: 0}}>
            {
                this.state.fltrs.map((element:filter) => {
                    return <PreferenceQuestion key={element.name} questionAnswered={this.questionAnswered} filt={element}/>
                })
            }
            </div>
        )
    }
}

export class PreferenceQuestion extends React.Component<{filt:filter, questionAnswered:Function}> {
    readonly state = {positive:true};

    constructor(props:any) {
        super(props);
    }
    positive = () => {
        this.setState({positive:true});
        this.props.questionAnswered();
    }
    negative = () => {
        this.setState({positive:false});
        this.props.questionAnswered();
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
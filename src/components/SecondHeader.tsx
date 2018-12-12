import * as React from "react";
import axios from "axios";
import * as Main from "./MainPage";
import * as Util from "./Utilities";
import * as $ from "jquery";

interface filter {name:string, type:string, question:string, default:string, userPref:string};

class PrefSignIn extends React.Component {
    readonly state = {showPopup:false}
    showFilters = () => {
         Main.mainBus.notifyObservers("showFilters");   
         $("#preferenceHeader").css({visibility:"hidden"});
         document.getElementById("mainBody").scrollIntoView({block:"start", behavior:"smooth"});
    }
    render() {
       return <div id="preferenceSignIn">
            <div onClick={this.showFilters}><u>View all filters</u></div>
       </div>
    }
}

export class SecondHeader extends React.Component {
    readonly state = {selectedGenre:"All"}
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
        if (this.props.val !== "More" && !this.props.chosen) {
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

interface prefBeltState {filters:[], leftMarg:number};

class PreferenceBelt extends React.Component implements Util.observer {
    readonly state:prefBeltState = {filters:[], leftMarg:0}

    index : number = 0;
    changedBetween: boolean = false;

    componentWillMount() {
        axios.get("\pref-filters.json").then(
            (response) => {
                var filters = response.data;
                Util.userFilters.setList(filters);
                this.setState({filters:Util.shuffleArray(filters)})
                this.convey();
            }
        )
    }

    observe(ob:Util.observable) {
        ob.observers.push(this);
    }
    notified(observable:any, event:string) {
        if (event == "filtersSet" || event == "filterChanged") {
            this.setState({filters:Util.userFilters.getFilters()})
        }
    }

    nextQuestion = () => {
        var rect = $(".prefQuestion")[0].getBoundingClientRect();
        this.index += 1;
        var animationTime = 600;
        if (this.index >= this.state.filters.length) {
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
                this.state.filters.map((element:filter) => {
                    return <PreferenceQuestion key={element.name} questionAnswered={this.questionAnswered} filt={element}/>
                })
            }
            </div>
        )
    }
}

export class PreferenceQuestion extends React.Component<{filt:filter, questionAnswered:Function}> {
    readonly state = {pref : this.props.filt.userPref || this.props.filt.default}
    constructor(props:any) {
        super(props);
    }

    change = (val:string) => {
        Util.userFilters.changeFilter(this.props.filt.name, val);
        this.setState({pref:val})
        this.props.questionAnswered();
    }

    render() {
        return (
            <div className="prefQuestion">
            {this.props.filt.question}
                <div className="questionOptions">
                    <span className="affirmative" onClick={()=>{this.change("yes")}}>
                    {(this.state.pref == "yes") ? <i className="far fa-check-square"></i>: <i className="far fa-square"></i>}
                        <span>Yes</span>
                    </span>
                    <span className="negative" onClick={()=>{this.change("no")}}>
                    {(this.state.pref != "yes") ? <i className="far fa-check-square"></i>: <i className="far fa-square"></i>}
                        <span>No</span>
                    </span>
                </div>
            </div>
        )
    }
}
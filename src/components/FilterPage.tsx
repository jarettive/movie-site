import {subPageItem, mainview} from "./MainPage";
import * as React from "react";
import {observer, observable, userFilters} from "./Utilities";

class FilterItem extends React.Component<{filt:any}> {
    positive = () => {
        userFilters.changeFilter(this.props.filt.name, "yes");
    }
    negative = () => {
        userFilters.changeFilter(this.props.filt.name, "no");
    }
    render() {
        var pref = this.props.filt.userPref || this.props.filt.default;
        return (
            <div className="filterItem">
            {this.props.filt.name}
            <div className="questionOptions">
                    <span className="affirmative" onClick={this.positive}>
                    {(pref == "yes") ? <i className="far fa-check-square"></i>: <i className="far fa-square"></i>}
                        <span>Yes</span>
                    </span>
                    <span className="negative" onClick={this.negative}>
                    {(pref != "yes") ? <i className="far fa-check-square"></i>: <i className="far fa-square"></i>}
                        <span>No</span>
                    </span>
                </div>
            </div>
        );
    }
}

interface FPstate {filters:[], runtime:number, commonSense:number, budget:number, rottenTomatoes:number};

export class FilterPage extends React.Component<{item:subPageItem}> implements observer {
    readonly state:FPstate = {filters:[], runtime:240, commonSense:18, budget:0, rottenTomatoes:0};
    componentWillMount(){
        this.observe(userFilters);
    }
    observe(ob:observable) {
        ob.observers.push(this);
    }
    notified(observable:any, event:string) {
        if (event == "filtersSet" || event == "filterChanged") {
            this.setState({filters:userFilters.getFilters()})
        }
    }
    render() {
        var hours = Math.floor(this.state.runtime/60);
        return (
            <div id="filterPage" className={this.props.item.show ? "shown" : "hidden"}>
                <div id="filterTitle">Filters</div>
                <div id="filterBody">
                    <div>
                        <div className="filterType view_service">
                        <div className="typeHeader">Service</div>
                        {
                            this.state.filters.map((filt:any, idx) =>{
                                if (filt.type == "view_service") {
                                    return <FilterItem key={idx} filt={filt}/>
                                }
                            })
                        }
                        </div>
                        <div className="filterType content">
                        <div className="typeHeader">Content</div>
                    {
                        this.state.filters.map((filt:any, idx) =>{
                            if (filt.type == "content") {
                                return <FilterItem key={idx} filt={filt}/>
                            }
                        })
                    }
                        </div>
                    </div>
                    <div>
                        <div className="filterType runtime">
                        <div className="typeHeader">Runtime</div>
                            <div className="descriptor">Must have a runtime &#8804; {hours + " hour" + ((hours>1) ? "s " : " ") + (this.state.runtime%60) + " minutes"}</div>
                            <input className="slider" value={this.state.runtime} onChange={(event)=>{this.setState({runtime:event.target.value})}} type="range" min="60" max="240"/>
                        </div>
                        <div className="filterType commonSense">
                        <div className="typeHeader">CommonSenseMedia</div>
                            <div className="descriptor">Must have a CommonSenseMedia rating &#8804; {this.state.commonSense}</div>
                            <input className="slider" value={this.state.commonSense} onChange={(event)=>{this.setState({commonSense:event.target.value})}} type="range" min="2" max="18"/>
                        </div>
                        <div className="filterType rottenTomatoes">
                        <div className="typeHeader">RottenTomatoes</div>
                            <div className="descriptor">Must have a RottenTomatoes score &#8805; {this.state.rottenTomatoes}%</div>
                            <input className="slider" value={this.state.rottenTomatoes} onChange={(event)=>{this.setState({rottenTomatoes:event.target.value})}} type="range" min="0" max="100"/>
                        </div>
                        <div className="filterType budget">
                        <div className="typeHeader">Budget</div>
                        <div className="descriptor">Must have a budget &#8805; {this.state.budget} million</div>
                            <input className="slider" onChange={(event)=>{this.setState({budget:event.target.value})}} value={this.state.budget} type="range" min="0" max="300"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
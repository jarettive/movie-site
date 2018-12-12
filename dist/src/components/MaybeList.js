"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainPage_1 = require("./MainPage");
const React = require("react");
class MaybeList {
    constructor() {
        this.list = [];
        this.observers = [];
        this.add = (movie) => {
            var found = this.list.find((mov) => {
                return mov.id == movie.id;
            });
            if (this.list.length < 8 && !found) {
                this.list.push(movie);
                this.notifyObservers("maybeListChanged");
            }
        };
        this.remove = (movieID) => {
            this.list = this.list.filter((movie) => {
                return (movie.id != movieID);
            });
            this.notifyObservers("maybeListChanged");
        };
        this.getList = () => {
            return this.list;
        };
    }
    notifyObservers(event) {
        this.observers.forEach(element => {
            element.notified(this, event);
        });
    }
}
exports.maybeList = new MaybeList();
class MaybeListComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { hover: false, list: [], chosenIdx: -1, trueChosen: -1 };
        this.ogListSize = 0;
        this.onMouseEnter = () => {
            this.setState({ hover: true });
            this.ogListSize = this.state.list.length;
        };
        this.onMouseLeave = () => {
            this.setState({ hover: false });
        };
        this.muvieChoose = () => {
            var timeToNextSwitch = 10;
            var func = () => {
                timeToNextSwitch += (timeToNextSwitch * (Math.random() / 3));
                this.setState({ chosenIdx: (this.state.chosenIdx + 1) % this.state.list.length });
                if (timeToNextSwitch < 800) {
                    setTimeout(func, timeToNextSwitch);
                }
            };
            func();
        };
    }
    observe(ob) {
        ob.observers.push(this);
    }
    notified(observable, event) {
        if (event == "maybeListChanged") {
            this.setState({ list: exports.maybeList.getList() });
        }
    }
    componentWillMount() {
        this.observe(exports.maybeList);
    }
    render() {
        var listCount = this.state.list.length;
        var hover = (this.state.list.length == 0) ? false : this.state.hover;
        var style = (hover) ? { width: (2 + this.ogListSize * 12) + "vw" } : (listCount < 1) ? { display: "none" } : {};
        return (React.createElement("div", { id: "maybeList", style: style, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave },
            React.createElement("div", { id: "maybeContainer" }, this.state.list.map((element, idx) => {
                return React.createElement(MaybeMovieComp, { key: idx, idx: idx, numInList: listCount, movie: element, choosing: idx == this.state.chosenIdx });
            })),
            React.createElement("div", { id: "maybeLabel" }, "Maybe List"),
            listCount > 1 &&
                React.createElement("i", { className: "muvieChoose fas fa-dice", onClick: this.muvieChoose },
                    React.createElement("div", { id: "muvieChooseHelper" }, "Choose for me!"))));
    }
}
exports.MaybeListComponent = MaybeListComponent;
class MaybeMovieComp extends React.Component {
    constructor() {
        super(...arguments);
        this.viewMovie = () => {
            MainPage_1.movieList.setCurrMovie(this.props.movie.id);
        };
        this.remove = (event) => {
            event.stopPropagation();
            exports.maybeList.remove(this.props.movie.id);
        };
    }
    render() {
        var imgPath = MainPage_1.img300_450_url + this.props.movie.poster_path;
        var style = { width: 100 / this.props.numInList + "%", left: (this.props.idx * 100 / this.props.numInList) + "%" };
        return (React.createElement("div", { className: "maybeMovie" + ((this.props.choosing) ? " choosing" : ""), style: style },
            React.createElement("img", { onClick: this.viewMovie, src: imgPath }),
            React.createElement("i", { onClick: this.remove, className: "remove fas fa-times-circle" }),
            React.createElement("i", { className: "chooseArrow fas fa-caret-up" }),
            React.createElement("div", { className: "movieTitle" }, this.props.movie.title)));
    }
}
//# sourceMappingURL=MaybeList.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MaybeList {
    constructor() {
        this.list = [];
        this.observers = [];
        this.add = (movie) => {
            if (this.list.length < 8) {
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
        this.state = { hover: false, list: [] };
        this.onMouseEnter = () => {
            this.setState({ hover: true });
        };
        this.onMouseLeave = () => {
            this.setState({ hover: false });
        };
    }
    observe(ob) {
        ob.observers.push(this);
    }
    notified(observable, event) {
        if (event == "maybeListChanged") {
            this.setState({ list: exports.maybeList.getList(), hover: false });
        }
    }
    componentWillMount() {
        this.observe(exports.maybeList);
    }
    render() {
        var listCount = this.state.list.length;
        var hover = (this.state.list.length == 0) ? false : this.state.hover;
        var style = (hover) ? { width: (2 + listCount * 12) + "vw" } : (listCount < 1) ? { display: "none" } : {};
        return (React.createElement("div", { id: "maybeList", style: style, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave },
            React.createElement("div", { id: "maybeContainer" }, this.state.list.map((element, idx) => {
                return React.createElement(MaybeMovieComp, { key: idx, idx: idx, numInList: listCount, movie: element });
            })),
            React.createElement("div", { id: "maybeBottom" },
                React.createElement("div", { id: "maybeLabel" }, "Maybe List"),
                listCount > 1 && React.createElement("i", { className: "muvieChoose fas fa-dice" }))));
    }
}
exports.MaybeListComponent = MaybeListComponent;
class MaybeMovieComp extends React.Component {
    constructor() {
        super(...arguments);
        this.viewMovie = () => {
        };
        this.remove = () => {
            exports.maybeList.remove(this.props.movie.id);
        };
    }
    render() {
        var style = { width: 100 / this.props.numInList + "%", left: (this.props.idx * 100 / this.props.numInList) + "%" };
        return (React.createElement("div", { className: "maybeMovie", style: style, onClick: this.viewMovie },
            React.createElement("img", { src: this.props.movie.img_path }),
            React.createElement("i", { onClick: this.remove, className: "remove fas fa-times-circle" }),
            React.createElement("div", { className: "movieTitle" }, this.props.movie.title)));
    }
}
//# sourceMappingURL=MaybeList.js.map
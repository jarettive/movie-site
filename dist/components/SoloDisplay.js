"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainPage_1 = require("./MainPage");
const React = require("react");
class SoloMovieDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidUpdate = () => {
            if (this.props.item.show) {
                this.boxRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
            }
        };
        this.boxRef = React.createRef();
    }
    render() {
        var time = (this.props.movie) ? this.props.movie.runtime : 0;
        return (React.createElement("div", { id: "soloMovieDisplay", className: this.props.item.show ? "shown" : "hidden", ref: this.boxRef },
            React.createElement("i", { id: "soloClose", className: "far fa-times-circle", onClick: () => { this.props.item.callBack(MainPage_1.mainview.last); } }),
            React.createElement("div", { className: "left" },
                React.createElement("img", { src: this.props.movie && MainPage_1.img600_900_url + this.props.movie.poster_path }),
                React.createElement("div", { id: "tagLine" })),
            React.createElement("div", { className: "right" }, this.props.movie &&
                React.createElement(React.Fragment, null,
                    React.createElement("div", { id: "soloTitle" }, this.props.movie.title),
                    React.createElement("div", { id: "overview" }, this.props.movie.overview),
                    React.createElement("div", { id: "runtime" }, Math.floor(time / 60) + " hours " + time % 60 + " minutes")))));
    }
}
exports.SoloMovieDisplay = SoloMovieDisplay;
//# sourceMappingURL=SoloDisplay.js.map
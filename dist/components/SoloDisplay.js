"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainPage_1 = require("./MainPage");
const React = require("react");
class SoloMovieDisplay extends React.Component {
    render() {
        return (React.createElement("div", { id: "soloMovieDisplay", className: this.props.item.show ? "shown" : "hidden" },
            React.createElement("i", { id: "soloClose", className: "far fa-times-circle", onClick: () => { this.props.item.callBack(MainPage_1.mainview.last); } }),
            React.createElement("img", { src: this.props.movie && MainPage_1.img600_900_url + this.props.movie.poster_path })));
    }
}
exports.SoloMovieDisplay = SoloMovieDisplay;
//# sourceMappingURL=SoloDisplay.js.map
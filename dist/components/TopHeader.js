"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MainPage_1 = require("./MainPage");
const Utilities_1 = require("./Utilities");
class TopSignIn extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { showPopup: false };
        this.togglePopup = () => {
            // this.setState({showPopup:!this.state.showPopup});
            Utilities_1.unimplemented();
        };
    }
    render() {
        return (React.createElement("div", { id: "topSignIn" },
            React.createElement("div", { onClick: this.togglePopup }, "Sign in"),
            this.state.showPopup && React.createElement(MainPage_1.SigninPopup, { closePopup: this.togglePopup.bind(this) })));
    }
}
///search/multi?language=en-US&query=zoo
class TopHeader extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { showText: true };
    }
    render() {
        return (React.createElement("div", { id: "topHeader" },
            React.createElement("div", { className: "vertCentered" },
                React.createElement("div", { id: "titleText" }, "MUVIE"),
                React.createElement("div", { id: "logoText" }, "find movies for you")),
            React.createElement("div", { className: "rightCentered" },
                React.createElement(TopSignIn, null),
                React.createElement("div", { id: "searchBar" },
                    this.state.showText &&
                        React.createElement("i", { className: "fas fa-search" }),
                    React.createElement("input", { type: "text", placeholder: this.state.showText == true ? "Search movies" : "", onChange: Utilities_1.unimplemented, onFocus: (inp) => { this.setState({ showText: false }); }, onBlur: (inp) => { this.setState({ showText: true }); } })))));
    }
}
exports.TopHeader = TopHeader;
//# sourceMappingURL=TopHeader.js.map
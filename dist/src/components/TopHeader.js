"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const axios_1 = require("axios");
const MainPage_1 = require("./MainPage");
const lodash_1 = require("lodash");
class TopHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showText: true, potentials: [] };
        this.search = (event) => {
            this.sendSearch(event.target.value);
        };
        this.sendSearch = (queryStr) => {
            axios_1.default.get("search", { params: { queryStr: queryStr } }).then((response) => {
                var sorted = response.data.results.sort((el1, el2) => (el2.popularity - el1.popularity));
                this.setState({ potentials: sorted.slice(0, 5) });
            });
        };
        this.sendSearch = lodash_1.debounce(this.sendSearch, 200);
    }
    render() {
        return (React.createElement("div", { id: "topHeader" },
            React.createElement("div", { className: "vertCentered" },
                React.createElement("div", { id: "titleText", onClick: () => { MainPage_1.movieList.filterList(["Hulu"]); } }, "MUVIE"),
                React.createElement("div", { id: "logoText" }, "find movies for you")),
            React.createElement("div", { className: "rightCentered" },
                React.createElement("div", { id: "searchBar" },
                    this.state.showText &&
                        React.createElement("i", { className: "fas fa-search" }),
                    React.createElement("input", { type: "text", placeholder: this.state.showText == true ? "Search movies" : "", onKeyDown: this.search, onFocus: (inp) => { this.setState({ showText: false }); }, onBlur: (inp) => { this.setState({ showText: true }); } }),
                    !this.state.showText && this.state.potentials.length > 0 &&
                        React.createElement("div", { id: "searchResults" }, this.state.potentials.map((element) => {
                            return React.createElement("div", null, element.title);
                        }))))));
    }
}
exports.TopHeader = TopHeader;
//# sourceMappingURL=TopHeader.js.map
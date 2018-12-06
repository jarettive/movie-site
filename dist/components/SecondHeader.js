"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const axios_1 = require("axios");
const Main = require("./MainPage");
const Util = require("./Utilities");
const $ = require("jquery");
;
let filters = [];
class PrefSignIn extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { showPopup: false };
        this.showFilters = () => {
            Main.mainBus.notifyObservers("showFilters");
        };
    }
    render() {
        return React.createElement("div", { id: "preferenceSignIn" },
            React.createElement("div", { onClick: this.showFilters },
                React.createElement("u", null, "View all filters")));
    }
}
class SecondHeader extends React.Component {
    render() {
        return (React.createElement("div", { id: "secondHeader" },
            React.createElement("div", { id: "preferenceHeader" },
                React.createElement("div", { id: "questionsBanner" },
                    React.createElement(PreferenceBelt, null)),
                React.createElement(PrefSignIn, null)),
            React.createElement("div", { id: "genreHeader" },
                React.createElement("div", { id: "genreHeaderInner" }, Main.popularGenres.map(element => {
                    return React.createElement(GenreTab, { key: Main.theMDBGenreMap[element], val: element });
                })))));
    }
}
exports.SecondHeader = SecondHeader;
function getGenre(element) {
    element = (element.toLowerCase() === "musical") ? "Music" : element;
    element = (element.toLowerCase() === "sci-fi") ? "Science Fiction" : element;
    axios_1.default.get("getGenre", {
        params: {
            genreID: Main.theMDBGenreMap[element]
        }
    }).then((response) => {
        Main.movieList.setMovies(response.data.results);
    });
}
class MoreMenu extends React.Component {
    render() {
        return (React.createElement("div", { className: "genreMenu" }, Main.otherGenres.map((element) => {
            return (React.createElement("div", { onClick: () => getGenre(element) }, element));
        })));
    }
}
class GenreTab extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { showPopupMenu: false };
        this.click = () => {
            if (this.props.val !== "More") {
                getGenre(this.props.val);
            }
        };
        this.mouseEnter = () => {
            if (this.props.val == "More") {
                this.setState({ showPopupMenu: true });
            }
        };
        this.mouseLeave = () => {
            if (this.props.val == "More") {
                this.setState({ showPopupMenu: false });
            }
        };
    }
    render() {
        return (React.createElement("a", { className: "genreTab", onClick: this.click.bind(this), onMouseEnter: this.mouseEnter.bind(this), onMouseLeave: this.mouseLeave },
            React.createElement("div", null, this.props.val),
            this.state.showPopupMenu && React.createElement(MoreMenu, null)));
    }
}
class PreferenceBelt extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { fltrs: filters, leftMarg: 0 };
        this.index = 0;
        this.changedBetween = false;
        this.nextQuestion = () => {
            var rect = $(".prefQuestion")[0].getBoundingClientRect();
            this.index += 1;
            var animationTime = 600;
            if (this.index >= this.state.fltrs.length) {
                this.index = 0;
                animationTime = 1;
            }
            var top = -rect.height * this.index;
            $("#prefBelt").animate({ marginTop: top + "px" }, animationTime);
        };
        this.convey = () => {
            const el = document.getElementById("prefBelt");
            setInterval(() => {
                if (!this.changedBetween) {
                    this.nextQuestion();
                }
                this.changedBetween = false;
            }, 10000);
        };
        this.questionAnswered = () => {
            this.nextQuestion();
            this.changedBetween = true;
        };
    }
    componentWillMount() {
        axios_1.default.get("\pref-filters.json").then((response) => {
            filters = response.data;
            Util.shuffleArray(filters);
            this.setState({ fltrs: filters });
            this.convey();
        });
    }
    render() {
        return (React.createElement("div", { id: "prefBelt", style: { marginTop: 0 } }, this.state.fltrs.map((element) => {
            return React.createElement(PreferenceQuestion, { key: element.name, questionAnswered: this.questionAnswered, filt: element });
        })));
    }
}
class PreferenceQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = { positive: true };
        this.positive = () => {
            this.setState({ positive: true });
            this.props.questionAnswered();
        };
        this.negative = () => {
            this.setState({ positive: false });
            this.props.questionAnswered();
        };
    }
    render() {
        return (React.createElement("div", { className: "prefQuestion" },
            this.props.filt.question,
            React.createElement("div", { className: "questionOptions" },
                React.createElement("span", { className: "affirmative", onClick: this.positive },
                    this.state.positive ? React.createElement("i", { className: "far fa-check-square" }) : React.createElement("i", { className: "far fa-square" }),
                    React.createElement("span", null, "Yes")),
                React.createElement("span", { className: "negative", onClick: this.negative },
                    !this.state.positive ? React.createElement("i", { className: "far fa-check-square" }) : React.createElement("i", { className: "far fa-square" }),
                    React.createElement("span", null, "No")))));
    }
}
//# sourceMappingURL=SecondHeader.js.map
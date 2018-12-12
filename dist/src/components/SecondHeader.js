"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const axios_1 = require("axios");
const Main = require("./MainPage");
const Util = require("./Utilities");
const $ = require("jquery");
;
class PrefSignIn extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { showPopup: false };
        this.showFilters = () => {
            Main.mainBus.notifyObservers("showFilters");
            $("#preferenceHeader").css({ visibility: "hidden" });
            document.getElementById("mainBody").scrollIntoView({ block: "start", behavior: "smooth" });
        };
    }
    render() {
        return React.createElement("div", { id: "preferenceSignIn" },
            React.createElement("div", { onClick: this.showFilters },
                React.createElement("u", null, "View all filters")));
    }
}
class SecondHeader extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { selectedGenre: "All" };
        this.genreClicked = (val) => {
            this.setState({ selectedGenre: val });
        };
    }
    render() {
        return (React.createElement("div", { id: "secondHeader" },
            React.createElement("div", { id: "preferenceHeader" },
                React.createElement("div", { id: "questionsBanner" },
                    React.createElement(PreferenceBelt, null)),
                React.createElement(PrefSignIn, null)),
            React.createElement("div", { id: "genreHeader" },
                React.createElement("div", { id: "genreHeaderInner" }, Main.popularGenres.map(element => {
                    return React.createElement(GenreTab, { callback: this.genreClicked, chosen: element == this.state.selectedGenre, key: Main.theMDBGenreMap[element] || element, val: element });
                })))));
    }
}
exports.SecondHeader = SecondHeader;
class MoreMenu extends React.Component {
    render() {
        return (React.createElement("div", { className: "genreMenu" }, Main.otherGenres.map((element) => {
            return (React.createElement("div", { key: element, onClick: () => Util.getGenre(element) }, element));
        })));
    }
}
class GenreTab extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { showPopupMenu: false };
        this.click = () => {
            if (this.props.val !== "More" && !this.props.chosen) {
                Util.getGenre(this.props.val);
                this.props.callback(this.props.val);
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
        var className = "genreTab" + ((this.props.chosen) ? " chosen" : "");
        return (React.createElement("a", { className: className, onClick: this.click.bind(this), onMouseEnter: this.mouseEnter.bind(this), onMouseLeave: this.mouseLeave },
            React.createElement("div", null, this.props.val),
            this.state.showPopupMenu && React.createElement(MoreMenu, null)));
    }
}
;
class PreferenceBelt extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { filters: [], leftMarg: 0 };
        this.index = 0;
        this.changedBetween = false;
        this.nextQuestion = () => {
            var rect = $(".prefQuestion")[0].getBoundingClientRect();
            this.index += 1;
            var animationTime = 600;
            if (this.index >= this.state.filters.length) {
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
            }, 6500);
        };
        this.questionAnswered = () => {
            this.nextQuestion();
            this.changedBetween = true;
        };
    }
    componentWillMount() {
        axios_1.default.get("\pref-filters.json").then((response) => {
            var filters = response.data;
            Util.userFilters.setList(filters);
            this.setState({ filters: Util.shuffleArray(filters) });
            this.convey();
        });
    }
    observe(ob) {
        ob.observers.push(this);
    }
    notified(observable, event) {
        if (event == "filtersSet" || event == "filterChanged") {
            this.setState({ filters: Util.userFilters.getFilters() });
        }
    }
    render() {
        return (React.createElement("div", { id: "prefBelt", style: { marginTop: 0 } }, this.state.filters.map((element) => {
            return React.createElement(PreferenceQuestion, { key: element.name, questionAnswered: this.questionAnswered, filt: element });
        })));
    }
}
class PreferenceQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pref: this.props.filt.userPref || this.props.filt.default };
        this.change = (val) => {
            Util.userFilters.changeFilter(this.props.filt.name, val);
            this.setState({ pref: val });
            this.props.questionAnswered();
        };
    }
    render() {
        return (React.createElement("div", { className: "prefQuestion" },
            this.props.filt.question,
            React.createElement("div", { className: "questionOptions" },
                React.createElement("span", { className: "affirmative", onClick: () => { this.change("yes"); } },
                    (this.state.pref == "yes") ? React.createElement("i", { className: "far fa-check-square" }) : React.createElement("i", { className: "far fa-square" }),
                    React.createElement("span", null, "Yes")),
                React.createElement("span", { className: "negative", onClick: () => { this.change("no"); } },
                    (this.state.pref != "yes") ? React.createElement("i", { className: "far fa-check-square" }) : React.createElement("i", { className: "far fa-square" }),
                    React.createElement("span", null, "No")))));
    }
}
exports.PreferenceQuestion = PreferenceQuestion;
//# sourceMappingURL=SecondHeader.js.map
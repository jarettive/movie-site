"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var axios_1 = require("axios");
var Main = require("./MainPage");
var Util = require("./Utilities");
;
var filters = [];
var PrefSignIn = /** @class */ (function (_super) {
    __extends(PrefSignIn, _super);
    function PrefSignIn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { showPopup: false };
        _this.togglePopup = function () {
            _this.setState({ showPopup: !_this.state.showPopup });
        };
        return _this;
    }
    PrefSignIn.prototype.render = function () {
        return React.createElement("div", { id: "preferenceSignIn" },
            React.createElement("div", { onClick: this.togglePopup },
                React.createElement("u", null, "Sign in"),
                " to keep preferences"),
            this.state.showPopup && React.createElement(Main.SigninPopup, { closePopup: this.togglePopup.bind(this) }));
    };
    return PrefSignIn;
}(React.Component));
var SecondHeader = /** @class */ (function (_super) {
    __extends(SecondHeader, _super);
    function SecondHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecondHeader.prototype.render = function () {
        return (React.createElement("div", { id: "secondHeader" },
            React.createElement("div", { id: "preferenceHeader" },
                React.createElement("div", { id: "questionsBanner" },
                    React.createElement(PreferenceBelt, null)),
                React.createElement(PrefSignIn, null)),
            React.createElement("div", { id: "genreHeader" },
                React.createElement("div", { id: "genreHeaderInner" }, Main.popularGenres.map(function (element) {
                    return React.createElement(GenreTab, { key: Main.theMDBGenreMap[element], val: element });
                })))));
    };
    return SecondHeader;
}(React.Component));
exports.SecondHeader = SecondHeader;
var MoreMenu = /** @class */ (function (_super) {
    __extends(MoreMenu, _super);
    function MoreMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoreMenu.prototype.render = function () {
        return (React.createElement("div", { className: "genreMenu" }, Main.otherGenres.map(function (element) {
            return (React.createElement("div", null, element));
        })));
    };
    return MoreMenu;
}(React.Component));
var GenreTab = /** @class */ (function (_super) {
    __extends(GenreTab, _super);
    function GenreTab() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { showPopupMenu: false };
        _this.click = function () {
            var contentStr = "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_genres="
                + Main.theMDBGenreMap[_this.props.val];
            axios_1.default.get(Main.theMDBURL + "discover/movie?" + Main.theMDBKey + contentStr).then(function (response) {
                Main.movieList.setMovies(response.data.results);
            });
        };
        _this.mouseEnter = function () {
            if (_this.props.val == "More") {
                _this.setState({ showPopupMenu: true });
            }
        };
        _this.mouseLeave = function () {
            if (_this.props.val == "More") {
                _this.setState({ showPopupMenu: false });
            }
        };
        return _this;
    }
    GenreTab.prototype.render = function () {
        return (React.createElement("a", { className: "genreTab", onClick: this.click.bind(this), onMouseEnter: this.mouseEnter.bind(this), onMouseLeave: this.mouseLeave },
            this.props.val,
            this.state.showPopupMenu && React.createElement(MoreMenu, null)));
    };
    return GenreTab;
}(React.Component));
var PreferenceBelt = /** @class */ (function (_super) {
    __extends(PreferenceBelt, _super);
    function PreferenceBelt() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { fltrs: filters, leftMarg: 0 };
        _this.convey = function () {
            setInterval(function () {
                var el = document.getElementById("prefBelt");
                var num = parseInt(el.style.marginLeft);
                var str = (num - 1) + "px";
                el.style.marginLeft = str;
            }, 76);
        };
        return _this;
    }
    PreferenceBelt.prototype.componentWillMount = function () {
        var _this = this;
        axios_1.default.get("\pref-filters.json").then(function (response) {
            filters = response.data;
            Util.shuffleArray(filters);
            _this.setState({ fltrs: filters });
            _this.convey();
        });
    };
    PreferenceBelt.prototype.render = function () {
        var style = { marginLeft: this.state.leftMarg };
        return (React.createElement("div", { id: "prefBelt", style: style }, this.state.fltrs.map(function (element) {
            return React.createElement(PreferenceQuestion, { key: element.name, filt: element });
        })));
    };
    return PreferenceBelt;
}(React.Component));
var PreferenceQuestion = /** @class */ (function (_super) {
    __extends(PreferenceQuestion, _super);
    function PreferenceQuestion(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { positive: true };
        _this.positive = function () {
            _this.setState({ positive: true });
        };
        _this.negative = function () {
            _this.setState({ positive: false });
        };
        return _this;
    }
    PreferenceQuestion.prototype.render = function () {
        return (React.createElement("div", { className: "prefQuestion" },
            this.props.filt.question,
            React.createElement("div", { className: "questionOptions" },
                React.createElement("span", { className: "affirmative", onClick: this.positive },
                    this.state.positive ? React.createElement("i", { className: "far fa-check-square" }) : React.createElement("i", { className: "far fa-square" }),
                    React.createElement("span", null, "Yes")),
                React.createElement("span", { className: "negative", onClick: this.negative },
                    !this.state.positive ? React.createElement("i", { className: "far fa-check-square" }) : React.createElement("i", { className: "far fa-square" }),
                    React.createElement("span", null, "No")))));
    };
    return PreferenceQuestion;
}(React.Component));
//# sourceMappingURL=SecondHeader.js.map
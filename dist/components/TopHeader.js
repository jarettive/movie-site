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
var MainPage_1 = require("./MainPage");
var Utilities_1 = require("./Utilities");
var TopSignIn = /** @class */ (function (_super) {
    __extends(TopSignIn, _super);
    function TopSignIn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { showPopup: false };
        _this.togglePopup = function () {
            // this.setState({showPopup:!this.state.showPopup});
            Utilities_1.unimplemented();
        };
        return _this;
    }
    TopSignIn.prototype.render = function () {
        return (React.createElement("div", { id: "topSignIn" },
            React.createElement("div", { onClick: this.togglePopup }, "Sign in"),
            this.state.showPopup && React.createElement(MainPage_1.SigninPopup, { closePopup: this.togglePopup.bind(this) })));
    };
    return TopSignIn;
}(React.Component));
var TopHeader = /** @class */ (function (_super) {
    __extends(TopHeader, _super);
    function TopHeader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { showText: true };
        return _this;
    }
    TopHeader.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { id: "topHeader" },
            React.createElement("div", { className: "vertCentered" },
                React.createElement("div", { id: "titleText" }, "MUVIE"),
                React.createElement("div", { id: "logoText" }, "find movies for you")),
            React.createElement("div", { className: "rightCentered" },
                React.createElement(TopSignIn, null),
                React.createElement("div", { id: "searchBar" },
                    this.state.showText &&
                        React.createElement("i", { className: "fas fa-search" }),
                    React.createElement("input", { type: "text", placeholder: this.state.showText == true ? "Search movies" : "", onChange: Utilities_1.unimplemented, onFocus: function (inp) { _this.setState({ showText: false }); }, onBlur: function (inp) { _this.setState({ showText: true }); } })))));
    };
    return TopHeader;
}(React.Component));
exports.TopHeader = TopHeader;
//# sourceMappingURL=TopHeader.js.map
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
var MainHeader = /** @class */ (function (_super) {
    __extends(MainHeader, _super);
    function MainHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainHeader.prototype.render = function () {
        return (React.createElement("div", { id: "MainHeader" }, "Wuddup Hjhunter"));
    };
    return MainHeader;
}(React.Component));
var MainBody = /** @class */ (function (_super) {
    __extends(MainBody, _super);
    function MainBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainBody.prototype.render = function () {
        return (React.createElement("div", { id: "MainBody" },
            React.createElement("div", { id: "MainButton", onClick: clickEvent }, "Button")));
    };
    return MainBody;
}(React.Component));
var clickEvent = function (e) {
    axios_1.default.get("zoowee");
};
var MainPage = /** @class */ (function (_super) {
    __extends(MainPage, _super);
    function MainPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainPage.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(MainHeader, null),
            React.createElement(MainBody, null)));
    };
    return MainPage;
}(React.Component));
exports.MainPage = MainPage;
//# sourceMappingURL=Hello.js.map
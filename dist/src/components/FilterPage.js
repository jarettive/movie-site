"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Utilities_1 = require("./Utilities");
class FilterItem extends React.Component {
    constructor() {
        super(...arguments);
        this.positive = () => {
            Utilities_1.userFilters.changeFilter(this.props.filt.name, "yes");
        };
        this.negative = () => {
            Utilities_1.userFilters.changeFilter(this.props.filt.name, "no");
        };
    }
    render() {
        var pref = this.props.filt.userPref || this.props.filt.default;
        return (React.createElement("div", { className: "filterItem" },
            this.props.filt.name,
            React.createElement("div", { className: "questionOptions" },
                React.createElement("span", { className: "affirmative", onClick: this.positive },
                    (pref == "yes") ? React.createElement("i", { className: "far fa-check-square" }) : React.createElement("i", { className: "far fa-square" }),
                    React.createElement("span", null, "Yes")),
                React.createElement("span", { className: "negative", onClick: this.negative },
                    (pref != "yes") ? React.createElement("i", { className: "far fa-check-square" }) : React.createElement("i", { className: "far fa-square" }),
                    React.createElement("span", null, "No")))));
    }
}
;
class FilterPage extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { filters: [], runtime: 240, commonSense: 18, budget: 0, rottenTomatoes: 0 };
    }
    componentWillMount() {
        this.observe(Utilities_1.userFilters);
    }
    observe(ob) {
        ob.observers.push(this);
    }
    notified(observable, event) {
        if (event == "filtersSet" || event == "filterChanged") {
            this.setState({ filters: Utilities_1.userFilters.getFilters() });
        }
    }
    render() {
        var hours = Math.floor(this.state.runtime / 60);
        return (React.createElement("div", { id: "filterPage", className: this.props.item.show ? "shown" : "hidden" },
            React.createElement("div", { id: "filterTitle" }, "Filters"),
            React.createElement("div", { id: "filterBody" },
                React.createElement("div", null,
                    React.createElement("div", { className: "filterType view_service" },
                        React.createElement("div", { className: "typeHeader" }, "Service"),
                        this.state.filters.map((filt, idx) => {
                            if (filt.type == "view_service") {
                                return React.createElement(FilterItem, { key: idx, filt: filt });
                            }
                        })),
                    React.createElement("div", { className: "filterType content" },
                        React.createElement("div", { className: "typeHeader" }, "Content"),
                        this.state.filters.map((filt, idx) => {
                            if (filt.type == "content") {
                                return React.createElement(FilterItem, { key: idx, filt: filt });
                            }
                        }))),
                React.createElement("div", null,
                    React.createElement("div", { className: "filterType runtime" },
                        React.createElement("div", { className: "typeHeader" }, "Runtime"),
                        React.createElement("div", { className: "descriptor" },
                            "Must have a runtime \u2264 ",
                            hours + " hour" + ((hours > 1) ? "s " : " ") + (this.state.runtime % 60) + " minutes"),
                        React.createElement("input", { className: "slider", value: this.state.runtime, onChange: (event) => { this.setState({ runtime: event.target.value }); }, type: "range", min: "60", max: "240" })),
                    React.createElement("div", { className: "filterType commonSense" },
                        React.createElement("div", { className: "typeHeader" }, "CommonSenseMedia"),
                        React.createElement("div", { className: "descriptor" },
                            "Must have a CommonSenseMedia rating \u2264 ",
                            this.state.commonSense),
                        React.createElement("input", { className: "slider", value: this.state.commonSense, onChange: (event) => { this.setState({ commonSense: event.target.value }); }, type: "range", min: "2", max: "18" })),
                    React.createElement("div", { className: "filterType rottenTomatoes" },
                        React.createElement("div", { className: "typeHeader" }, "RottenTomatoes"),
                        React.createElement("div", { className: "descriptor" },
                            "Must have a RottenTomatoes score \u2265 ",
                            this.state.rottenTomatoes,
                            "%"),
                        React.createElement("input", { className: "slider", value: this.state.rottenTomatoes, onChange: (event) => { this.setState({ rottenTomatoes: event.target.value }); }, type: "range", min: "0", max: "100" })),
                    React.createElement("div", { className: "filterType budget" },
                        React.createElement("div", { className: "typeHeader" }, "Budget"),
                        React.createElement("div", { className: "descriptor" },
                            "Must have a budget \u2265 ",
                            this.state.budget,
                            " million"),
                        React.createElement("input", { className: "slider", onChange: (event) => { this.setState({ budget: event.target.value }); }, value: this.state.budget, type: "range", min: "0", max: "300" }))))));
    }
}
exports.FilterPage = FilterPage;
//# sourceMappingURL=FilterPage.js.map
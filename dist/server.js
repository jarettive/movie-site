"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
app_1.app.get('/zoowee', function (req, res) {
    res.send("zoo wee back at ya");
});
app_1.http.listen(app_1.app.get("port"), function () {
    console.log(("  App is running at http://localhost:%d in %s mode"), app_1.app.get("port"), app_1.app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
//# sourceMappingURL=server.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
exports.app = express();
exports.http = require("http").Server(exports.app);
exports.app.set("port", process.env.PORT || 3000);
exports.app.use(express.static(path.join(__dirname, "../")));
//# sourceMappingURL=app.js.map
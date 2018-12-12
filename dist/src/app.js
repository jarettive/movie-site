"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
exports.app = express();
exports.http = require("http").Server(exports.app);
exports.app.set("port", process.env.PORT || 3000);
exports.app.use(express.static(path.join(__dirname, "../")));
//# sourceMappingURL=app.js.map
import * as express from "express";
import * as path from "path";

export const app = express();
export const http = require("http").Server(app);

app.set("port", process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, "../")));
console.log("hello!!");

const express = require("express");
//const req = require("express/lib/request");
const http = require("http");
const path = require("path");

const {routesInit} = require("./routes/config_rotes");
require("./db/mongoConnect");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || "3000";
server.listen(port);

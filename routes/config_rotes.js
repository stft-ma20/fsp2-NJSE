const indexR = require("./index") ;
const usersR = require("./users") ;
const toysR = require("./toys") ;
//const loginR = require("./login");

exports.routesInit = (app) =>{
    app.use("/", indexR);
    app.use("/users", usersR);
    app.use("/toys", toysR);

}
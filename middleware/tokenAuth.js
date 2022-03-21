const jwt = require("jsonwebtoken");

exports.authToken = async (req, res, next) => {

    console.log("token authentication proccess:");

    let userToken = req.header("auth-token");
    if (userToken) {
        console.log("   -token found:");
    } else {
        console.log("   -Erorr: token not found!");
        return res.json({ message: "Error: token not found!" });
    }

    try {
        console.log("   -token beign verified...");
        let decodeToken = jwt.verify(userToken, "SECRETKEY");
        console.log("   -token valid!");
        req.tokenData = decodeToken;
        next();
    } catch (error) {
        res.json({ message: "invalid token" });

    }

}
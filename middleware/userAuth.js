const { UserModel } = require("../models/userModel");
const { ToyModel } = require("../models/toyModel");


exports.userAuth = async (req, res, next) => {
  console.log("user authentication proccess:");

  let toyID = req.params.delID || req.params.editID;
  let toyData = await ToyModel.findOne({ _id:toyID}, { _id: 0, User_id: 1 });
  let userData = await UserModel.findOne({ _id: req.tokenData }, { role: 1 });

  if(toyData){
    console.log("   -Toy founed in database.");
    console.log("   -Toy's id: " + toyData._id);
  }else{
    console.log("   -Error: Invalid toy ID");
    return res.json({ msg: "Error: Invalid toy ID" });
  }

  if(userData) {
    console.log("   -User founed in database.");
    console.log("   -Toy's owner ID: " + toyData.User_id);
  } else {
    console.log("   -Error: User not found by the provided ID");
    return res.json({ msg: "Error: User not found by the provided ID" });
  }


  if (userData.role.toUpperCase() == "ADMIN") {
    req.userAuthStatus = "User is admin";
    //console.log(req.userAuthStatus);
    return next()
  } else if (toyData.User_id == userData._id) {
    req.userAuthStatus = "User is owner of the toy";
    //console.log(req.userAuthStatus);
    return next()
  }

  res.json({ msg: "User is not Admin or the owner of the toy!" });


}
const express = require("express");
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
const {UserModel, validateUser, validateLogin, genToken} = require("../models/userModel");
const { authToken } = require("../middleware/tokenAuth");
const router = express.Router();


router.get("/", async(req,res) =>{
    let userData = await UserModel.find({});
    res.json(userData);
})

router.post("/", async (req,res) =>{

    let validatedBody = validateUser(req.body);
    if(validatedBody.error){
        return res.status(400).json({msg:validatedBody.error.details});
    }

    try {
        let newUser = new UserModel(req.body);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();
        console.log("new user saved!");
        newUser.password ="*****";
        res.json(newUser);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
})

router.post("/login", async(req,res) =>{
   
    let validatedBody = validateLogin(req.body);
    if(validatedBody.error){
        return res.status(400).json({msg:validatedBody.error.details});
    }

    let userData = await UserModel.findOne({email:req.body.email});
    
    if(!userData){
        return res.json({message:"this Email is invalid!"});
    }

    let password = await bcrypt.compare(req.body.password,userData.password);
    if(!password){
        return res.json({error: "Wrong password, try again!"});
    }

    let newToken = genToken(userData._id);
    return res.json({token: newToken});
})

router.get("/userinfo", authToken,async(req,res) => {
    
})

module.exports = router;
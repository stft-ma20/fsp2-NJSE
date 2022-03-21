const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");


let userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    date_created:{type:Date, default: new Date().toDateString()},
    role:{type:String, default:"USER"}
})

exports.UserModel = mongoose.model("users",userSchema);

exports.validateUser = (_userToValidate) =>{
    let joiUserSchema = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        email:Joi.string().min(6).max(200).required().email(),
        password:Joi.string().min(6).max(15).required(),
        role:Joi.string().min(2).max(10).valid("USER","ADMIN").insensitive().required(),
    })
    return joiUserSchema.validate(_userToValidate);
}

exports.validateLogin = (_loginToValidate) =>{
    let joiUserSchema = Joi.object({
        email:Joi.string().min(6).max(200).required().email(),
        password:Joi.string().min(6).max(15).required(),
    })
    return joiUserSchema.validate(_loginToValidate);
}

exports.genToken = (_userID) => {
    let token = jwt.sign({_id:_userID}, "SECRETKEY",{expiresIn:"15days"});
    return token;
}

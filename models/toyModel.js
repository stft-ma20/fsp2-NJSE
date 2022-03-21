const mongoose = require("mongoose");
const Joi = require("joi");


let toySchema = new mongoose.Schema({
    name:String,
    price:Number,
    info:String,
    category:String,
    img_url:String,
    date_created:{type:Date, default: Date().now},
    User_id:{type:String, default:"NONE"},
})

exports.ToyModel = mongoose.model("toys",toySchema);

exports.validateToy = (_toyToValidate) =>{
    let joiToySchema = Joi.object({
        name:Joi.string().min(3).max(99).required(),
        price:Joi.number().min(0.0).max(10000.0).required(),
        info:Joi.string().min(3).max(999).required(),
        category:Joi.string().min(3).max(999).required(),
        img_url:Joi.string().min(3).max(999).required(),
        //User_id:Joi.string().min(10).max(999),
    })

    return joiToySchema.validate(_toyToValidate);
}
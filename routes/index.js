const express = require("express");
const router = express.Router();

router.get("/", (req,res) =>{
    //res.json({msg:"hello from index.js"});
   // res.render('../views.index.html');
})

module.exports = router;
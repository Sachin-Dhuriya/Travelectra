const express = require("express");
const router = express.Router();
const asyncWrap = require("../../utils/wrapasync");
const ExpressError = require("../../utils/ExpressError");
const User = require("../../models/user.js");

router.get("/",(req,res)=>{
    res.render("listings/signup.ejs")
})

router.post("/",asyncWrap(async (req,res)=>{
try{
    let {username, email, password} = req.body;
    let newUser = new User({username,email})
    let registerUser = await User.register(newUser,password);
    console.log("User registered Successfull..."); 
    req.flash("success","User registered sucessfully...")
    res.redirect("/listing")
}catch(err){
    req.flash("success",err.message);
    res.redirect("/signup")
}  
}))

module.exports = router;

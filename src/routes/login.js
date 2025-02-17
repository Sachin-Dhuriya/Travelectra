const express = require("express");
const router = express.Router();
const asyncWrap = require("../../utils/wrapasync");
const passport = require('passport'); 

router.get("/",(req,res)=>{
    res.render("listings/login.ejs")
})
router.post(
    "/",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password!", 
    }),
    asyncWrap(async (req, res) => {
        req.flash("success", "Welcome Back User!");
        res.redirect("/listing");
    })
);


module.exports = router;
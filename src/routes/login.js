const express = require("express");
const router = express.Router();
const asyncWrap = require("../../utils/wrapasync");
const passport = require('passport'); 
const { saveRedirectUrl } = require("../middleware");

router.get("/",(req,res)=>{
    res.render("listings/login.ejs")
})
router.post(
    "/",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password!", 
    }),
    asyncWrap(async (req, res) => {
        req.flash("success", "Welcome Back User!");
        let redirect = res.locals.redirectUrl || "/listing"
        res.redirect(redirect);
    })
);


module.exports = router;
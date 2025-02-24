const express = require("express");
const router = express.Router();

router.get("/",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out Successfully...")
        res.redirect("/listing")
    })
})

module.exports = router;
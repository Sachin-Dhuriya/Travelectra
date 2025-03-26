const Listing = require("../models/listingDB.js")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please Login before performing the operation");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}   

module.exports.isOwner = async(req,res,next)=>{
    let {_id} = req.params;
    let listing = await Listing.findById(_id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You dont have permission");
        return res.redirect(`/listing/${_id}`)
    }
    next();
}
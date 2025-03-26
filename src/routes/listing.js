const express = require("express");
const router = express.Router();
const asyncWrap = require("../../utils/wrapasync");
const {listingSchema , reviewSchema} = require("../../models/schema.js")
const ExpressError = require("../../utils/ExpressError");
const Listing = require("../../models/listingDB.js")
const {isLoggedIn, isOwner} = require("../middleware.js");
const { findById } = require("../../models/reviews.js");
const validateListing = (req,res,next)=>{ 
    let {error} =  listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }else{
        next();
    }
}

router.get("/",asyncWrap(async (req, res) => {
    let listing = await Listing.find()
    res.render("./listings/listing", { listing })
})) 
//--------------------------------- Create/New Routes-------------------------------------

router.get("/new",isLoggedIn, (req, res) => {
    res.render("./listings/new")
})

router.post("/", validateListing ,asyncWrap(async (req, res, next) => {
    let newProperty = new Listing(req.body.listing);
    newProperty.owner = req.user._id;
    await newProperty.save();
    req.flash("success","New Listing Created...!!!")
    res.redirect("/listing")
})) 
//-------------------------------Show Routes--------------------------------
router.get("/:_id",asyncWrap(async (req, res) => {
    let { _id } = req.params;
    let data = await Listing.findById(_id).populate("reviews").populate("owner");
    if(!data){
        req.flash("error","The Listing is Deleted !!")
        res.redirect("./listings/listing")
    }else{
        res.render("./listings/show", { data })
    }
    
})) 

//--------------------------------Edit/Update route-------------------------------

router.get("/:_id/edit",isLoggedIn,isOwner,asyncWrap(async (req, res) => {
    let { _id } = req.params;
    let data = await Listing.findById(_id);
    res.render("./listings/edit", { data })
})) 

router.put("/:_id",isOwner, validateListing, asyncWrap(async (req, res) => {
    let { _id } = req.params;
    let listing = findById(_id)
    if(listing.owner._id.equals(currUser._id)){
        req.flash("success","You dont have permission to Edit");
        res.redirect(`/listing/${_id}`)
    }
    await Listing.findByIdAndUpdate(_id, { ...req.body.listing })
    req.flash("success","Listing Updated Successfully...!!!")
    res.redirect(`/listing/${_id}`)
}))

//----------------------------------Delete route--------------------------------------------
router.delete("/:_id",isLoggedIn,isOwner,asyncWrap(async (req, res) => {
    let { _id } = req.params;
    await Listing.findByIdAndDelete(_id)
    req.flash("success","Listing Deleted Successfully...!!!")
    res.redirect("/listing")
})) 

module.exports = router;
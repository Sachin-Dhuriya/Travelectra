const express = require("express");
const router = express.Router({mergeParams : true});
const asyncWrap = require("../../utils/wrapasync");
const ExpressError = require("../../utils/ExpressError");
const Listing = require("../../models/listingDB.js")
const Review = require("../../models/reviews.js")
const {listingSchema , reviewSchema} = require("../../models/schema.js");
const { isLoggedIn } = require("../middleware.js");


const validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }else{ 
        next();
    }
}

//---------------------------------Review Route------------------------------------

router.post("/",isLoggedIn, validateReview, asyncWrap(async(req,res,next)=>{
    let _id = req.params;
    let review = req.body.review;
    let listing = await Listing.findById(_id)
    let newReview = new Review(review)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created...!!!")
    res.redirect(`/listing/${listing._id}`)
}))

//---------------------------------Review Delete Route------------------------------------

router.delete("/:reviewId",async(req,res)=>{
    let {_id , reviewId} = req.params;
    let listing = await Listing.findById(_id);
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted successfully...!!!")
    res.redirect(`/listing/${listing._id}`)
})

module.exports = router;
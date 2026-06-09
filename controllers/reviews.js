//this file stores callbacks for all reviews routes

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");



module.exports.createReview = async(req,res,next)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    //flash message
    req.flash("success", "New Review Created!");


    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async(req,res,next)=>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //pulling out or removing review from the reviews array in listing
    await Review.findByIdAndDelete(reviewId);

    //flash message
    req.flash("success", "Review Deleted!");


    res.redirect(`/listings/${id}`);
};
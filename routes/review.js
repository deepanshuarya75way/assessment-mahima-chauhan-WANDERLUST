const express=require("express");

//mergeParams allows us to access id from req.params from the parent(common) route
const router=express.Router({mergeParams:true}); //creating router object for related routes
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");


//requiring controllers
const reviewController=require("../controllers/reviews.js");


//Related routes - all routes containing /listings/:id/reviews
//Reviews - post review route
router.post("/",
    isLoggedIn, 
    validateReview,
    wrapAsync(reviewController.createReview)
);


//Delete - delete review route
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync(reviewController.destroyReview)
);

module.exports=router;
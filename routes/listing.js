const express=require("express");
const router=express.Router(); //creating router object for related routes
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
const SaveQuery = require("../models/saveQuery.js");


//requiring controllers
const listingController=require("../controllers/listings.js");


//Related routes - all routes containing /listings
router
    .route("/")
    .get(wrapAsync(listingController.index))  //Index Route - all listings
    .post(
       isLoggedIn, 
       validateListing, 
       upload.single('listing[image][url]'),
       wrapAsync(listingController.createListing)
    );  //Create route
     
    
//New route
router.get("/new", 
    isLoggedIn, 
    listingController.renderNewForm
);    


router
    .route("/:id")    
    .get(wrapAsync(listingController.showListing))  //Show route - specific listing
    .put(
        isLoggedIn, 
        isOwner,
        upload.single('listing[image][url]'), 
        validateListing, 
        wrapAsync(listingController.updateListing)  //Update Route
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing)
    );  //Delete route
     
    
//Edit route
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.renderEditForm)
);

//Search listing route
router.get("/search" ,
    isLoggedIn ,
    wrapAsync()
)

module.exports=router;
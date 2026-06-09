const express=require("express");
const router=express.Router(); //creating router object for related routes
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");


//requiring controllers
const userController=require("../controllers/users.js");


//Related routes - all routes containing /signup
router
    .route("/signup")
    .get(userController.renderSignupForm)  //Signup Route
    .post(wrapAsync(userController.signup)  //Post Route - saving user to DB
);


router
    .route("/login")
    .get(userController.renderLoginForm)  //Login Route
    .post(saveRedirectUrl, 
        passport.authenticate("local", { failureRedirect: '/login', failureFlash:true}), 
        userController.login
    );  //Authenticate user after login route - POST
    

//Logout route
router.get("/logout", userController.logout);


module.exports=router;
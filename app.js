if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const {MongoStore} = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

//requiring routers for related paths
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


app.set("view engine","ejs");
app.set("views", path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(dbUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


//mongo session store using connect-mongo
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter:24*3600,
});


store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});



//setting up express-session
const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, //expiry date of cookie set to one week from now
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


//Root route
app.get("/", (req,res)=>{
    res.redirect("/listings");
});



app.use(session(sessionOptions)); //using express-session middleware
app.use(flash()); //using connect-flash middleware
app.use(passport.initialize());
app.use(passport.session()); //ensures user doesn't have to login after each session
passport.use(new LocalStrategy(User.authenticate())); //ensures user gets authenticated using local strategy


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//to access flash message in ejs templates using middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; //stores info about current user
    next();
});


//storing fake user in DB
// app.get("/demouser", async(req,res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     //static method to register user
//     let registeredUser=await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


//using express router - all listings and reviews route
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//for all undefined routes
app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});
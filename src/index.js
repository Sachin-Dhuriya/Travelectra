    //-----------------------------Requiring Expres----------------------------
    const express = require("express");
    const app = express();
    const path = require("path");
    const port = 8080;
    //------------------------------Requiring Session---------------------------
    const session = require('express-session'); 
    //------------------------------Requiring passport---------------------------
    const passport = require('passport'); 
    const LocalStrategy = require('passport-local'); 
    //------------------------------Requiring flash---------------------------
    const flash = require('connect-flash');
    //------------------------------Setting EJS--------------------------
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "../views"))//-> use ../ because the views folder is outside the src folder
    app.use(express.static(path.join(__dirname, "../public")))
    //------------------------------Database Imports------------------------
    const Listing = require("../models/listingDB.js")
    const Review = require("../models/reviews.js")
    const User = require("../models/user.js");
    //-------------------------------Parsing Data---------------------------
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    //--------------------------------Method Override--------------------------
    var methodOverride = require('method-override')
    app.use(methodOverride('_method'))
    //-------------------------------EJS-Mate-----------------------------------
    const ejsMate = require("ejs-mate");
    app.engine("ejs", ejsMate);

    //------------------------------Defining session-------------------------------
    const sessionOptions = {
        secret: "mysupersecretcode",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,  
        }
    }
    app.use(session(sessionOptions));
    app.use(flash());
    
    //----------------Passport always after session middleware--------
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser()); 

    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error"); // Add error messages from failureFlash
        res.locals.currUser = req.user;
        next();
    });

    app.listen(port, () => {
        console.log(`App is listenning on port ${port}.....`);
    })
    //----------------------------------Requring asyncWrap-------------------------
    const asyncWrap = require("../utils/wrapasync");
    //----------------------------------Requring ExpressError-------------------------
    const ExpressError = require("../utils/ExpressError");
    const { error } = require("console");
    //-----------------------------------Requiring Listing---------------------------------
    const listing = require("./routes/listing.js")
    const review = require("./routes/review.js")
    const signup = require("./routes/signup.js")
    const login = require("./routes/login.js")
    const logout = require("./routes/logout.js")
    //----------------------------------JOI package (for Schema Validation)-------------------------
    const {listingSchema , reviewSchema} = require("../models/schema.js")

    //--------------------------------Routes------------------------------------
    //-------------------------------index Routes--------------------------------
    app.get("/", (req, res) => {
        res.render("./listings/home.ejs")
    })
    //-------------------------------Login/SignUp Routes--------------------------------
    app.use("/signup",signup);
    app.use("/login",login)
    app.use("/logout",logout)
    //-------------------------------Listing Routes--------------------------------
    app.use("/listing",listing)
    //-------------------------------Listing Routes--------------------------------
    app.use("/listing/:_id/review",review)

    //------------------------------------
    app.all("*",(req,res,next)=>{
        next(new ExpressError(404,"Page Not Found"))
    })
    //------------------------------------Error Handling-----------------------------------
    app.use((err, req, res, next) => {
        let {status = 500, message = "SOMETHING WENT WRONG"} = err;
        res.status(status).render("error.ejs",{message})
        //res.status(status).send(message);
    })


//-----------------------------Requiring Expres----------------------------
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
//------------------------------Setting EJS--------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"))//-> use ../ because the views folder is outside the src folder
app.use(express.static(path.join(__dirname, "../public")))
//------------------------------Database Imports------------------------
const Listing = require("./listingDB")
//-------------------------------Parsing Data---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
//--------------------------------Method Override--------------------------
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
//-------------------------------EJS-Mate-----------------------------------
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

app.listen(port, () => {
    console.log(`App is listenning on port ${port}.....`);
})
//----------------------------------Requring asyncWrap-------------------------
const asyncWrap = require("../utils/wrapasync");

//--------------------------------Routes------------------------------------
//-------------------------------index Routes--------------------------------
app.get("/", (req, res) => {
    res.render("./listings/home.ejs")
})
//-------------------------------Listing Routes--------------------------------
app.get("/listing", async (req, res) => {
    let listing = await Listing.find()
    res.render("./listings/listing", { listing })
})
//--------------------------------- Create/New Routes-------------------------------------

app.get("/listing/new", (req, res) => {
    res.render("./listings/new")
})

app.post("/listing",asyncWrap(async (req, res, next) => {
    let newProperty = new Listing(req.body.listing);
    await newProperty.save();
    res.redirect("/listing")
})) 
//-------------------------------Show Routes--------------------------------
app.get("/listing/:_id", async (req, res) => {
    let { _id } = req.params;
    let data = await Listing.findById(_id)
    res.render("./listings/show", { data })
})

//--------------------------------Edit/Update route-------------------------------

app.get("/listing/:_id/edit", async (req, res) => {
    let { _id } = req.params;
    let data = await Listing.findById(_id);
    res.render("./listings/edit", { data })
})

app.put("/listing/:_id", async (req, res) => {
    let { _id } = req.params;
    await Listing.findByIdAndUpdate(_id, { ...req.body.listing })
    res.redirect("/listing")
})

//----------------------------------Delete route--------------------------------------------
app.delete("/listing/:_id", async (req, res) => {
    let { _id } = req.params;
    await Listing.findByIdAndDelete(_id)
    res.redirect("/listing")
})


//------------------------------------Error Handling-----------------------------------

app.use((err, req, res, next) => {
    res.send("Something Went Wrong")
})


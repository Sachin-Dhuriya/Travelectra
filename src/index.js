//-----------------------------Requiring Expres----------------------------
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
//------------------------------Setting EJS--------------------------
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"../views"))//-> use ../ because the views folder is outside the src folder
//------------------------------Database Imports------------------------
const Listing = require("./listingDB")
//-------------------------------Parsing Data---------------------------
app.use(express.json());
app.use(express.urlencoded({extended : true}))
//--------------------------------Method Override--------------------------
var methodOverride = require('method-override')
app.use(methodOverride('_method'))



app.listen(port,()=>{
    console.log(`App is listenning on port ${port}.....`);
})
//--------------------------------Routes------------------------------------
//-------------------------------index Routes--------------------------------
app.get("/",(req,res)=>{
    res.send("Welcome to the home route")
})
//-------------------------------Listing Routes--------------------------------
app.get("/listing",async (req,res)=>{
    let listing = await Listing.find()
    res.render("./listings/listing",{listing})
})
//--------------------------------- Create/New Routes-------------------------------------

app.get("/listing/new",(req,res)=>{
    res.render("./listings/new")
})

app.post("/listing",(req,res)=>{
    let newProperty = new Listing(req.body.listing) ;
    newProperty.save().then(()=>{console.log("Property Saved Successfully.....");})
    res.redirect("/listing")
})
//-------------------------------Show Routes--------------------------------
app.get("/listing/:_id",async (req,res)=>{
    let {_id} = req.params;
    let data = await Listing.findById(_id)
    res.render("./listings/show",{data})
})

//--------------------------------Edit/Update route-------------------------------

app.get("/listing/:_id/edit",async (req,res)=>{
    let{_id} = req.params;
    let data = await Listing.findById(_id);
    res.render("./listings/edit",{data})
})

app.put("/listing/:_id",async (req,res)=>{
    let {_id} = req.params;
    await Listing.findByIdAndUpdate(_id,{...req.body.listing})
    res.redirect("/listing")
})

//----------------------------------Delete route--------------------------------------------
app.delete("/listing/:_id",async (req,res)=>{
    let{_id} = req.params;
    await Listing.findByIdAndDelete(_id)
    res.redirect("/listing")
})





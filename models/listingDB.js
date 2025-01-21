const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/Project1"
const Schema = mongoose.Schema;
async function main() {
    await mongoose.connect(mongoURL)
}

main().then(()=>{console.log("Connection Successfull.....");}).catch(()=>{console.log("Error occur at the time of connection");})

const listingSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true,
    },
    description :{
        type : String,
        required : true,
    },
    image :{
        type : String,
        required : true,
        default :"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Ffreebackground%2Fbeautiful-2d-house-scenery-free-3d-rendering_3018671.html&psig=AOvVaw3lj_4TLoksIo1ppuRze6rn&ust=1735658640507000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDf9rvmz4oDFQAAAAAdAAAAABAE", 
        set : (v)=> v===""? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Ffreebackground%2Fbeautiful-2d-house-scenery-free-3d-rendering_3018671.html&psig=AOvVaw3lj_4TLoksIo1ppuRze6rn&ust=1735658640507000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDf9rvmz4oDFQAAAAAdAAAAABAE" : v,
    },
    price :{
        type : Number,
        required : true,
    },
    location :{
        type : String,
        required : true,
    },
    country :{
        type : String,
        required : true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }]
})

const Listing = new mongoose.model("Listing",listingSchema)

module.exports = Listing;



const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const User=require('./user')

const reviewSchema=new Schema({
    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:User
    }
})

module.exports=mongoose.model("Review",reviewSchema)

//one to many relationships with campgrounds
//we are going to embed an array of object ids in each campground. 
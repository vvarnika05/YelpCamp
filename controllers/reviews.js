const campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview=async (req,res)=>{
    const cmpground=await campground.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    cmpground.reviews.push(review)
    await review.save()
    await cmpground.save()
    console.log("REVIEW CREATED:");
    req.flash('success','Added a new review')
    res.redirect(`/campgrounds/${cmpground._id}`)
}

module.exports.deleteReview=async (req,res)=>{
    await campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Successfully deleted a review')
    res.redirect(`/campgrounds/${req.params.id}`)
}
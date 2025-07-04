const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utilities/wrapAsync')
const campground = require('../models/campground')
const Review=require('../models/review')
const {validateReview,isLoggedIn}=require('../middleware')
const reviews=require('../controllers/reviews')

router.post('/',validateReview,isLoggedIn, wrapAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,wrapAsync(reviews.deleteReview)); 

module.exports=router;

const express=require('express');
const router=express.Router();
const wrapAsync=require('../utilities/wrapAsync')
const campgrounds=require('../controllers/campgrounds')
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware')
const multer=require('multer')
const{storage}=require('../cloudinary/index')
const upload=multer({storage})

router.get('/',wrapAsync(campgrounds.index))

router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.post('/',upload.array('image'),validateCampground,wrapAsync(campgrounds.createCampground))


router.get('/:id',wrapAsync(campgrounds.showCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,wrapAsync(campgrounds.renderEditCampground))

router.put('/:id', isLoggedIn,isAuthor,upload.array('image'),validateCampground,wrapAsync(campgrounds.updateCampground))
 
router.delete('/:id', isLoggedIn,isAuthor, wrapAsync(campgrounds.deleteCampground))

module.exports=router;
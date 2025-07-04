const {campgroundSchema}=require('./schemas.js')
const ExpressError=require('./utilities/ExpressError')
const campground=require('./models/campground.js')
const {reviewSchema}=require('./schemas.js')

// middleware.js
function isLoggedIn(req, res, next) {
    //store the url they were requesting before it changes to the login page 
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

function storeReturnTo(req, res, next){
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

function validateCampground(req,res,next){

    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

async function isAuthor (req,res,next){
    const {id}=req.params
    const foundcampground=await campground.findById(id);
    if (!foundcampground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    if(!foundcampground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!')
        return res.redirect(`/campground/:${id}`)
    }
    next()
}

function validateReview (req,res,next){
    const {error}=reviewSchema.validate(req.body);
        if(error){
            const msg=error.details.map(el=>el.message).join(',')
            throw new ExpressError(msg,400)
        }else{
            next();
        }
}

module.exports = {
    isLoggedIn,
    storeReturnTo,
    validateCampground,
    isAuthor,
    validateReview
};
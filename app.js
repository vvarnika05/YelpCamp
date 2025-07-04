if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const sanitizeV5 = require('./utilities/mongoSanitizeV5.js');
const express=require('express')
const app=express()
app.set('query parser', 'extended');
const path=require('path')
const mongoose=require('mongoose')
const ExpressError=require('./utilities/ExpressError')
const {campgroundSchema,reviewSchema}=require('./schemas.js')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate');
const session=require('express-session')
const flash=require('connect-flash')
const helmet=require('helmet')

const reviewRoutes=require('./routes/reviews')
const campgroundRoutes=require('./routes/campgrounds')
const userRoutes=require('./routes/users')

const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/user')
const MongoDBStore=require("connect-mongo")(session);
const dbUrl='mongodb://127.0.0.1:27017/yelp-camp'
//=process.env.DB_url
//console.log("DB URL:", dbUrl);
//mongodb://127.0.0.1:27017/yelp-camp

mongoose.connect(dbUrl)
    .then(()=>{
        console.log("MONGO Connection Open")
    })
    .catch((err)=>{
        console.log("OH NO MONGO CONNECTION ERROR")
        console.log(err)
    })



app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(sanitizeV5({ replaceWith: '_' }));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
// app.use(session())

const store=new MongoDBStore({
    url:dbUrl,
    secret:'thisshouldbeabettersecret',
    touchAfter: 24*60*60
})

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})


const sessionConfig={
    store,
    name:'session',
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())



app.use((req,res,next) =>{
    //console.log(req.query);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next()
})
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/darx0a663/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize())
app.use(passport.session()) //to stay logged in instead of logging in on every request.
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())






const validateCampground=(req,res,next)=>{

        const {error}=campgroundSchema.validate(req.body);
        if(error){
            const msg=error.details.map(el=>el.message).join(',')
            throw new ExpressError(msg,400)
        }else{
            next();
        }
}

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
        if(error){
            const msg=error.details.map(el=>el.message).join(',')
            throw new ExpressError(msg,400)
        }else{
            next();
        }
}

app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.use(express.static(path.join(__dirname,'public')))


app.use('/',userRoutes)


app.get('/',(req,res)=>{
    res.render('home')
})





app.all(/(.*)/,(req,res,next)=>{
   next(new ExpressError('Page not found',404))
})



app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Oh no something went wrong'
    res.status(statusCode).render('error',{err});
    //res.send("OH boy, something went wrong")
})

app.listen(3000,()=>{
    console.log("Listening on port 3000")
})


// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }

// const express = require('express');
// const app = express();
// app.set('query parser', 'extended');

// const path = require('path');
// const mongoose = require('mongoose');
// const methodOverride = require('method-override');
// const session = require('express-session');
// const flash = require('connect-flash');
// const helmet = require('helmet');
// const ejsMate = require('ejs-mate');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');

// const sanitizeV5 = require('./utilities/mongoSanitizeV5');
// const ExpressError = require('./utilities/ExpressError');
// const { campgroundSchema, reviewSchema } = require('./schemas.js');

// const campgroundRoutes = require('./routes/campgrounds');
// const reviewRoutes = require('./routes/reviews');
// const userRoutes = require('./routes/users');
// const User = require('./models/user');

// // MongoDB connection
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//     .then(() => {
//         console.log("MONGO Connection Open");
//     })
//     .catch((err) => {
//         console.log("OH NO MONGO CONNECTION ERROR");
//         console.log(err);
//     });

// // View engine
// app.engine('ejs', ejsMate);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware
// app.use(sanitizeV5({ replaceWith: '_' }));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')));

// // Session
// const sessionConfig = {
//     name: 'session',
//     secret: 'thisshouldbeabettersecret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         // secure: true, // Uncomment in production
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// };
// app.use(session(sessionConfig));
// app.use(flash());

// // Helmet for security
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
//     "https://cdn.maptiler.com/",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
//     "https://cdn.jsdelivr.net",
//     "https://cdn.maptiler.com/",
// ];
// const connectSrcUrls = [
//     "https://api.maptiler.com/",
// ];
// const fontSrcUrls = [];

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://api.maptiler.com/",
//                 "https://res.cloudinary.com/darx0a663/",
//                 "https://images.unsplash.com"
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls]
//         }
//     })
// );

// // Passport Auth
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // ✅ Flash and user middleware (must come AFTER session and BEFORE routes)
// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// });

// // Validators (optional)
// const validateCampground = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

// // Routes
// app.use('/campgrounds', campgroundRoutes);
// app.use('/campgrounds/:id/reviews', reviewRoutes);
// app.use('/', userRoutes);

// // Root Route
// app.get('/', (req, res) => {
//     res.render('home');
// });

// // 404 Handler
// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page not found', 404));
// });

// // Error Handler
// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = 'Oh no something went wrong';
//     res.status(statusCode).render('error', { err });
// });

// // Start server
// app.listen(3000, () => {
//     console.log("Listening on port 3000");
// });

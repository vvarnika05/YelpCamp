const campground = require('../models/campground')
const {cloudinary}=require('../cloudinary')
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index=async (req,res)=>{
    const campgrounds=await campground.find({})
    res.render('index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('new')
 }

module.exports.createCampground=async(req,res)=>{
   

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const newcampground=new campground (req.body.campground)
     console.log("GeoData:", JSON.stringify(geoData, null, 2));
    newcampground.geometry = geoData.features[0].geometry;
    newcampground.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    newcampground.author=req.user._id
    await newcampground.save();
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${newcampground._id}`) 
 }

// module.exports.createCampground = async (req, res) => {
//     try {
//         const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
//         console.log("GeoData:", JSON.stringify(geoData, null, 2));

//         const newcampground = new campground(req.body.campground);

//         // If location found, add geometry
//         if (geoData.features && geoData.features.length > 0) {
//             newcampground.geometry = geoData.features[0].geometry;
//         } else {
//             req.flash('error', '❗ Invalid location. Please try again.');
//             return res.redirect('/campgrounds/new');
//         }

//         // Add images and author
//         newcampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
//         newcampground.author = req.user._id;

//         await newcampground.save();
//         req.flash('success', 'Successfully made a new campground');
//         res.redirect(`/campgrounds/${newcampground._id}`);

//     } catch (err) {
//         console.error("❌ Error creating campground:", err);
//         req.flash('error', 'Something went wrong while creating the campground.');
//         res.redirect('/campgrounds/new');
//     }
// };


 module.exports.showCampground=async (req,res)=>{
    const campgrounds=await campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campgrounds){
        req.flash('error','cannot find that campground')
        return res.redirect('/campgrounds'); 
    }
    console.log(campgrounds);
    res.render('show',{campgrounds})
}

module.exports.renderEditCampground=async (req,res)=>{
    const {id}=req.params;
    const campgrounds=await campground.findById(id)
    if(!campgrounds){
        req.flash('error','cannot find that campground')
    }
    res.render('edit',{campgrounds});

}

module.exports.updateCampground=async (req,res)=>{
    const {id}=req.params;
    console.log(req.body.deleteImages);
    const updatedCampground=await campground.findByIdAndUpdate(id,{...req.body.campground})
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    updatedCampground.geometry = geoData.features[0].geometry;
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    updatedCampground.images.push(...imgs)
    await updatedCampground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCampground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        console.log(updatedCampground)
    }
    req.flash('success','Successfully updated campground')
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}

module.exports.deleteCampground=async(req,res)=>{
    const {id}=req.params
    await campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted a campground')
    res.redirect('/campgrounds')
}
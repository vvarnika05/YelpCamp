const cloudinary=require('cloudinary').v2
const {CloudinaryStorage}=require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

const storage=new CloudinaryStorage({ //the cloudinary storage is set up
    cloudinary,
    params:{
        folder:'YelpCamp', //folder in cloudinary in which we should store things
        allowedFormats:['jpeg','png','jpg']
    }
})

module.exports={
    cloudinary,
    storage
}
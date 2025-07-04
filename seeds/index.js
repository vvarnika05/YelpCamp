//going to connect to mongoose and also use the model
const path=require('path')
const mongoose=require('mongoose')
const cities=require('./cities')
const {descriptors,places}=require('./seedHelpers')
const campground = require('../models/campground')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=>{
        console.log("MONGO Connection Open")
    })
    .catch((err)=>{
        console.log("OH NO MONGO CONNECTION ERROR")
        console.log(err)
    })

    const sample=array=>array[Math.floor(Math.random()*array.length)];
    const seedDB=async()=>{
        await campground.deleteMany({});
        for(let i=0;i<200;i++){
            const random1000=Math.floor(Math.random()*1000);
            const price=Math.floor(Math.random()*20)+10;
            const camp=new campground({
                author:'68629f61df256ff5620ee93d',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur inventore, doloremque consequuntur deserunt adipisci esse sunt recusandae necessitatibus quibusdam et, accusamus ad. Ad in ea accusantium rem suscipit eaque minima?',
                price:price,
                geometry:{
                    type:"Point",
                    coordinates:[
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ]
                },
                images:[{
                    url: 'https://res.cloudinary.com/darx0a663/image/upload/v1751372061/YelpCamp/hvhlsliwltnmsqvb2bwm.png',
                    filename: 'YelpCamp/hvhlsliwltnmsqvb2bwm',
                    
                 },
                  {
                    url: 'https://res.cloudinary.com/darx0a663/image/upload/v1751372065/YelpCamp/b6vbpjt50ugvrgkaocty.png',
                    filename: 'YelpCamp/b6vbpjt50ugvrgkaocty',
                    
                  }
                ]
            })
            await camp.save();
        }
        
    }

    seedDB().then(()=>{
        mongoose.connection.close()
    })









// const path = require('path');
// const mongoose = require('mongoose');
// const cities = require('./cities');
// const { descriptors, places } = require('./seedHelpers');
// const campground = require('../models/campground');
// const maptilerClient = require('@maptiler/client');
// require('dotenv').config();

// // Configure MapTiler
// maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//   .then(() => {
//     console.log("MONGO Connection Open");
//   })
//   .catch((err) => {
//     console.log("OH NO MONGO CONNECTION ERROR");
//     console.log(err);
//   });

// const sample = array => array[Math.floor(Math.random() * array.length)];

// const seedDB = async () => {
//   await campground.deleteMany({});
//   for (let i = 0; i < 50; i++) {
//     const random1000 = Math.floor(Math.random() * 1000);
//     const city = cities[random1000];
//     const location = `${city.city}, ${city.state}`;
//     const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });

//     // fallback if coordinates are missing
//     if (!geoData.features || geoData.features.length === 0) {
//       console.log(`⚠️ No geometry found for ${location}`);
//       continue; // skip this one
//     }

//     const camp = new campground({
//       author: '68629f61df256ff5620ee93d',
//       location,
//       title: `${sample(descriptors)} ${sample(places)}`,
//       description:
//         'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur inventore, doloremque consequuntur deserunt adipisci esse sunt recusandae necessitatibus quibusdam et, accusamus ad. Ad in ea accusantium rem suscipit eaque minima?',
//       price: Math.floor(Math.random() * 20) + 10,
//       geometry: geoData.features[0].geometry, // this adds the coordinates
//       images: [
//         {
//           url: 'https://res.cloudinary.com/darx0a663/image/upload/v1751372061/YelpCamp/hvhlsliwltnmsqvb2bwm.png',
//           filename: 'YelpCamp/hvhlsliwltnmsqvb2bwm'
//         },
//         {
//           url: 'https://res.cloudinary.com/darx0a663/image/upload/v1751372065/YelpCamp/b6vbpjt50ugvrgkaocty.png',
//           filename: 'YelpCamp/b6vbpjt50ugvrgkaocty'
//         }
//       ]
//     });
//     await camp.save();
//   }
// };

// seedDB().then(() => {
//   mongoose.connection.close();
// });

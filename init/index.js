const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require('../models/listing.js');

const mapToken= 'cR7odzSuJ7lIwPqDn8PD' ;
const {  config,
    geocoding,
    geolocation,
    coordinates,
    } = require('@maptiler/client');
    const maptilerClient=require('@maptiler/client');

    console.log(mapToken);

async function main (){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
    console.log('connected to DB');
})
.catch(err=>{
    console.log(err);
});  

const initDB=async()=>{
   await Listing.deleteMany({});
   for (const obj of initData.data) {
    // Geocode the location
    maptilerClient.config.apiKey = mapToken;
    let location=obj.location+","+obj.country;
    const result = await maptilerClient.geocoding.forward(location);
console.log(result.features[0].geometry)
    // Set the geometry property
    obj.geometry = result.features[0].geometry;

    // Set the owner
    obj.owner = "661ec676a37665d345e30b7a";
}
   await Listing.insertMany(initData.data );
   console.log('data was initialized');
};

initDB();
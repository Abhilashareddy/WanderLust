const Listing=require('../models/listing.js')
const mapToken= process.env.MAP_TOKEN ;
const {  config,
    geocoding,
    geolocation,
    coordinates,
    } = require('@maptiler/client');
    const maptilerClient=require('@maptiler/client')
  

//Index Route 
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings }); 
    };


//New &Create Route
module.exports.renderNewForm=(req,res)=>{
    res.render('listings/new');
};   


//Read / Show Route  
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
   if(!listing)
   {
    req.flash('error','Listing you requested for does not exist!');
    res.redirect('/listings');
   }
   res.render('listings/show',{listing});
};


//create Route
module.exports.createListing=async (req,res,next)=>{
   
    let url=req.file.path;
   let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    
    maptilerClient.config.apiKey =mapToken ;
    const result = await maptilerClient.geocoding.forward(req.body.listing.location);
    newListing.geometry=result.features[0].geometry;
    let savedListings=await newListing.save();
    req.flash("success",'New Listing Created!');
    res.redirect('/listings');
    
};


//Edit
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
   {
    req.flash('error','Listing you requested for does not exist!');
    res.redirect('/listings');
   }

   let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/h_350,w_400");
    res.render('listings/edit.ejs',{listing,originalImageUrl});
};


//update
module.exports.updateListings=async (req,res)=>{
    let {id}=req.params;
    let editListing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    console.log(req.file);

    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(req.file);
    editListing.image={url,filename};
    maptilerClient.config.apiKey =mapToken ;
    const result = await maptilerClient.geocoding.forward(editListing.location);
    console.log(req.body.listing.location);
    editListing.geometry=result.features[0].geometry;
    console.log(editListing.geometry);
    await editListing.save();
}
    req.flash("success",'Listing Updated!');
      res.redirect(`/listings/${id}`);
    };

    
//Delete listing
module.exports.deleteListings=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id).then((result)=>{
        console.log(result);
    });
    req.flash("success",'Listing Deleted!');
      res.redirect('/listings');
}
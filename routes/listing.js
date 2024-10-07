const express = require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require("../models/listing.js");
const User=require("../models/user.js");
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const listingController=require('../controllers/listings.js');
const multer=require('multer');
const {storage}=require('../cloudConfig.js')
const upload=multer({storage});
router
  .route("/")
  .get(wrapAsync(listingController.index))  //Index Route 
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync (listingController.createListing))  //create Route


//New &Create Route
router.get('/new',isLoggedIn,listingController.renderNewForm);

router
  .route('/:id')
  .get(wrapAsync (listingController.showListing))   //Read or Show Route  
  .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListings))  //update
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListings));     //Delete listing

//Edit
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;
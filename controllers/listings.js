const { Router } = require("express");
const Listing=require("../models/listing");


//InDEX
module.exports.index=async (req,res)=>{
    const allListing= await Listing.find({});
    res.render("listings/index.ejs",{allListing})
    }

//New
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
    }


//Show 
module.exports.ShowListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");
    if(!listing){
     req.flash("error","Listing you requested for does not exist") ;
     res.redirect("/listings")
    }
   
    res.render("listings/show.ejs",{listing})
    }
      
    //edit
module.exports.renderEditListing=async(req,res)=>{
    let {id}=req.params;

    const listing=await Listing.findById(id);
  
    if(!listing){
      req.flash("error","Listing you requested for does not exist") ;
      res.redirect("/listings")
     }
     let originalImageUrl=listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl})
}



//create
  module.exports.createListing =async(req,res,next)=>{
  let url=req.file.path;
  let filename=req.file.filename;

        const newListing=new Listing(req.body.listing)
        
        newListing.owner=req.user._id;
        newListing.image={url, filename};
        await newListing.save();
       req.flash("success","New Listing Created ");
        res.redirect("/listings")
  
    }

    //update
  module.exports.updateListing =async(req,res,next)=>{
    
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
     

     req.flash("success","Listing Updated")
     res.redirect(`/listings/${id}`);
    }


    //delete
    module.exports.deletedListing=async(req,res)=>{
        let {id}=req.params;
      let deletedListing  = await Listing.findByIdAndDelete(id); 
      console.log(deletedListing);
      req.flash("success","Listing Deleted")
      res.redirect("/Listings");
    }
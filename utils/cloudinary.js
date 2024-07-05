const express = require("express");
const multer = require("multer");

const cloudinary = require("cloudinary").v2; // Ensure using cloudinary.v2
const fileSystem = require("fs");
const asyncHandler = require("express-async-handler");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// Upload an image
// const uploadFile = async (filePath) => {
//   try {
//     if (!filePath) return null;
//     // Upload file on Cloudinary
//     const response = await cloudinary.uploader.upload(filePath, {
//       resource_type: "auto",
//     });
//     console.log("File is uploaded on cloudinary");

//     console.log(response.url);
//     fileSystem.unlinkSync(filePath)
//     return response;
//   } catch (error) {
//     fileSystem.unlinkSync(filePath); // Remove the locally saved file if the upload operation failed
//     console.log(error.message);
//     console.log("error in cloudinay file");
//     return null;
//   }
// };


const uploadMultiple = asyncHandler(async(req,res,next)=>{
  try {
    
    const images = req.files;
    console.log(images);
    const imageURLs = [];

    for(const image of images){
      const result = await cloudinary.uploader.upload(image.path,{
        resource_type:"auto"

      });
    console.log("File is uploaded on cloudinary");
    // console.log(result.url);


      imageURLs.push(result.secure_url);
    }

    req.images = imageURLs;
    console.log("URL",req.images);


    next()

  } catch (error) {
    console.log(error.message);
    
  }
})

module.exports = uploadMultiple ;

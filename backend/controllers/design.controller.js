import mongoose from "mongoose";
import Design from "../models/design.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs'

const DEFAULT_PROFILE_PIC = "https://res.cloudinary.com/dabeupfqq/image/upload/v1735668108/profile_sgelul.png";

export const getAllDesign = async (req, res) =>{
    try{
        const body = await Design.find({});
        res.status(201).json({success:true, message:body});
        console.log("Design Details Fetched");
    }catch(err){
        res.status(500).json({success:false, message:"Server Error"});
        console.log("Error in Fetching User Details");
    }
}

export const getDesign = async (req, res) => {
    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({
            success: false, 
            message: "Design not found",
        });
    }
    
    
    try{
        const returned = await Design.findById(id);
        if(!returned) return res.status(404).json({
            success: false, 
            message: "Design not found",
        });
        res.status(201).json({success:true, message:returned});
        console.log("Design Details Fetched");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in fetching design",
        });
        console.log("Error in Fetching design data");
    }
}   

export const postDesign = async (req, res) => {
    const body = req.body;

    if(typeof body?.stitching?.mrp == 'string'){
        body.stitching.mrp = parseInt(body.stitching.mrp);
        body.stitching.sp = parseInt(body.stitching.sp);
        body.stitching.cp = parseInt(body.stitching.cp);
    }
    
    if(typeof body?.stitching?.commision == 'string'){
        body.stitching.commision = parseInt(body.stitching.commision);
    }


    try{
        const arrayImage = req.files.map(async (singleFile, index)=>{
            return cloudinary.uploader.upload(singleFile.path, {
                folder: 'designs',
            }).then((result)=>{
                fs.unlinkSync(singleFile.path);
                return {
                    url: result.url,
                    alt: singleFile.originalname
                };
            });
        })

        let dataImages = await Promise.all(arrayImage);
        
        const newProduct = await Design.create({
            ...body,
            images: dataImages
        })

        res.status(201).json({
            success: true,
            message: newProduct,
        })
        console.log("Design Added");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in adding design",
        });
        console.log("Error in adding design", err);
    }
}

export const deleteDesign = async (req, res) => {
    const {id} = req.params;
    
    const designExists = await Design.findById(id);
    if(!mongoose.Types.ObjectId.isValid(id)||!designExists){
        return res.status(404).json({
            success: false, 
            message: "design not found",
        });
    }

    try{
        await Design.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message:`Design ${id} deleted`,
        });
        console.log(`Design ${id} deleted`);
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in deleting user data",
        });
        console.log('User Deletion - Error');
    }
}

export const putDesign = async (req, res) => {
    const {id} = req.params;
    const body = req.body;

    if(typeof body?.stitching?.mrp == 'string'){
            body.stitching.mrp = parseInt(body.stitching.mrp);
            body.stitching.sp = parseInt(body.stitching.sp);
            body.stitching.cp = parseInt(body.stitching.cp);
    }
    if(typeof body?.commision == 'string'){
        body.commision = parseInt(body.commision);
    }

    const DesignExists = await Design.findById(id); 
    if(!mongoose.Types.ObjectId.isValid(id)||!DesignExists){
        return res.status(404).json({
            success: false, 
            message: "Design not found",
        });
    }

    try{
        const arrayImage = req.files.map(async (singleFile, index)=>{
            return cloudinary.uploader.upload(singleFile.path, {
                folder: 'fabrics',
            }).then((result)=>{
                fs.unlinkSync(singleFile.path);
                return {
                    url: result.url,
                    alt: singleFile.originalname
                };
            });
        })

        let dataImages = await Promise.all(arrayImage);
        if(dataImages.length>0) body.images = dataImages;


        await Design.findByIdAndUpdate(id, body);
        res.status(200).json({
            success: true,
            message: body
        })
        console.log(`Design ${id} updated`);
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in updating design",
        });
        console.log(`Error - design not updated: ${err}`);
    }
}
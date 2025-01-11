import mongoose from "mongoose";
import Fabric from "../models/fabric.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs'

export const getAllFabric = async (req, res) =>{
    try{
        const body = await Fabric.find({});
        res.status(201).json({success:true, message:body});
        console.log("Fabric Details Fetched");
    }catch(err){
        res.status(500).json({success:false, message:"Server Error"});
        console.log("Error in Fetching Fabric Details");
    }
}

export const getFabric = async (req, res) => {
    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({
            success: false, 
            message: "Fabric not found",
        });
    }
    
    
    try{
        const returned = await Fabric.findById(id);
        if(!returned) return res.status(404).json({
            success: false, 
            message: "Fabric not found",
        });
        res.status(201).json({success:true, message:returned});
        console.log("Fabric Details Fetched");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in fetching Fabric",
        });
        console.log("Error in Fetching Fabric data");
    }
}   

export const postFabric = async (req, res) => {
    const body = req.body;
    console.log(body);

    if(typeof body?.meterprice?.mrp == 'string'){
        body.meterprice.mrp = parseInt(body.meterprice.mrp);
        body.meterprice.sp = parseInt(body.meterprice.sp);
        body.meterprice.cp = parseInt(body.meterprice.cp);
    }
    
    if(typeof body?.meterprice?.commision == 'string'){
        body.meterprice.commision = parseInt(body.meterprice.commision);
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
        
        const newProduct = await Fabric.create({
            ...body,
            images: dataImages
        })

        res.status(201).json({
            success: true,
            message: newProduct,
        })
        console.log("Fabric Added");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in adding fabric",
        });
        console.log("Error in adding fabric", err);
    }
}

export const deleteFabric = async (req, res) => {
    const {id} = req.params;
    
    const FabricExists = await Fabric.findById(id);
    if(!mongoose.Types.ObjectId.isValid(id)||!FabricExists){
        return res.status(404).json({
            success: false, 
            message: "Fabric not found",
        });
    }

    try{
        await Fabric.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message:`Fabric ${id} deleted`,
        });
        console.log(`Fabric ${id} deleted`);
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in deleting Fabric data",
        });
        console.log('Fabric Deletion - Error');
    }
}

export const putFabric = async (req, res) => {
    const {id} = req.params;
    const body = req.body;

    if(typeof body?.meterprice?.mrp == 'string'){
        body.meterprice.mrp = parseInt(body.meterprice.mrp);
        body.meterprice.sp = parseInt(body.meterprice.sp);
        body.meterprice.cp = parseInt(body.meterprice.cp);
    }
    if(typeof body?.stock == 'string'){
        body.stock = parseInt(body.stock);
    }

    const FabricExists = await Fabric.findById(id); 
    if(!mongoose.Types.ObjectId.isValid(id)||!FabricExists){
        return res.status(404).json({
            success: false, 
            message: "Fabric not found",
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

        await Fabric.findByIdAndUpdate(id, body);
        res.status(200).json({
            success: true,
            message: body
        })
        console.log(`Fabric ${id} updated`);
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in updating Fabric",
        });
        console.log(`Error - Fabric not updated: ${err}`);
    }
}
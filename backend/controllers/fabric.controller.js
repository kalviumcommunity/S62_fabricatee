import mongoose from "mongoose";
import Fabric from "../models/fabric.model.js";

export const getAllFabric = async (req, res) =>{
    try{
        const body = await Fabric.find({});
        res.status(201).json({success:true, message:body});
        console.log("Fabric Details Fetched");
    }catch(err){
        res.status(500).json({success:false, message:"Server Error"});
        console.log("Error in Fetching User Details");
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

    try{
        const fabric = new Fabric(body);
        fabric.save();
        res.status(201).json({
            success: true,
            message: body,
        })
        console.log("Fabric Added");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in adding Fabric",
        });
        console.log("Error in adding Fabric");
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
            message:`Blog ${id} deleted`,
        });
        console.log(`User ${id} deleted`);
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in deleting user data",
        });
        console.log('User Deletion - Error');
    }
}

export const putFabric = async (req, res) => {
    const {id} = req.params;
    const body = req.body;


    const FabricExists = await Fabric.findById(id); 
    if(!mongoose.Types.ObjectId.isValid(id)||!FabricExists){
        return res.status(404).json({
            success: false, 
            message: "Fabric not found",
        });
    }

    try{
        const out = await Fabric.findByIdAndUpdate(id, body);
        console.log(out);
        res.status(200).json({
            success: true,
            message: out
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
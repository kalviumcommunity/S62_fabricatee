import mongoose from "mongoose";
import Design from "../models/design.model.js";

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

    try{
        const design = new Design(body);
        design.save();
        res.status(201).json({
            success: true,
            message: body,
        })
        console.log("Design Added");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in adding design",
        });
        console.log("Error in adding design");
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

export const putDesign = async (req, res) => {
    const {id} = req.params;
    const body = req.body;


    const designExists = await findById(id); 
    if(!mongoose.Types.ObjectId.isValid(id)||!designExists){
        return res.status(404).json({
            success: false, 
            message: "design not found",
        });
    }

    try{
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
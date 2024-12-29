import mongoose from "mongoose";
import DashUser from '../models/dashUser.model.js';

export const getAllUser = async (req, res) =>{
    try{
        const body = await DashUser.find({});
        res.status(201).json({success:true, message:body});
        console.log("User Details Fetched");
    }catch(err){
        res.status(500).json({success:false, message:"Server Error"});
        console.log("Error in Fetching User Details");
    }
}

export const getUser = async (req, res) => {
    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({
            success: false, 
            message: "user not found",
        });
    }
    
    
    try{
        const returned = await DashUser.findById(id);
        if(!returned) return res.status(404).json({
            success: false, 
            message: "user not found",
        });
        res.status(201).json({success:true, message:returned});
        console.log("User Details Fetched");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in fetching user data",
        });
        console.log("Error in Fetching user data");
    }
}   

export const postUser = async (req, res) => {
    const body = req.body;

    //check if the email already exists
    const userExists = await DashUser.findOne({email: body.email});
    if(userExists){
        res.status(400).json({success: false, message: "User already exists"});
    }

    try{
        const user = new DashUser(body);
        user.save();
        res.status(201).json({
            success: true,
            message: body,
        })
        console.log("User Created");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in fetching user data",
        });
        console.log("Error in Fetching user data");
    }
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;
    
    const userExists = await DashUser.findOne({email: body.email});
    if(!mongoose.Types.ObjectId.isValid(id)||!userExists){
        return res.status(404).json({
            success: false, 
            message: "user not found",
        });
    }

    try{
        await DashUser.findByIdAndDelete(id);
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

export const putUser = async (req, res) => {
    const {id} = req.params;
    const body = req.body;

    const userExists = await DashUser.findById(id);
    if(!mongoose.Types.ObjectId.isValid(id)||!userExists){
        return res.status(404).json({
            success: false, 
            message: "user not found",
        });
    }

    try{
        await DashUser.findByIdAndUpdate(id, body);
        res.status(200).json({
            success: true,
            message: body
        })
        console.log(`User ${id} updated`);
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in updating user data",
        });
        console.log(`Error - User not updated: ${err}`);
    }
}
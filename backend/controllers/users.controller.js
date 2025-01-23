import mongoose from "mongoose";
import User from '../models/users.model.js'
import dashUser from '../models/dashUser.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

export const refreshToken = (req, res) => {
    const token = req.cookies?.token;
    // console.log("Cookies",req.cookies);
    // console.log("token",token);
    try{
        if (!token) {
            return res.status(401).json({ success: false, loggedIn:false, message: "Not logged in" });
        }
        jwt.verify(token, REFRESH_SECRET_KEY, async (err, user)=>{
            if(err) res.status(403).json({ success: false, loggedIn: false, message: "Invalid token" });
            let userData = await User.findById(user._id).populate(["cart.design", "cart.fabric", "wishlist.design", "wishlist.fabric"]);
            userData = userData.toObject();
            const accessToken = jwt.sign({role: user.role, ...userData}, process.env.SECRET_KEY, {expiresIn: '15m'}); 
            console.log("Refresh Token created");
            return res.status(200).json({ success: true, message: "Refresh Token created", loggedIn: true, userId: user._id, accessToken, ...userData });
        });
    }catch(err){
        console.log(err);
    }
};

export const userLogin = async(req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email: email}).populate(["cart.design", "cart.fabric", "wishlist.design", "wishlist.fabric"]);
        if(!user){
            return res.status(401).json({success: false, message: "User not found"});
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email and/or password",
            });
        }

        //Generate Tokens
        const userData = user.toObject();
        const accessToken = jwt.sign({role: 'user', ...userData}, SECRET_KEY, {expiresIn: '15m'}, );
        const refreshToken = jwt.sign({role: 'user', _id: userData._id, email: userData.email}, REFRESH_SECRET_KEY, {expiresIn: '7d'}, );
        // console.log(accessToken);
        return res.status(200)
            .cookie('token', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 7*24*60*60*1000, // 1 hour expiration time
            })
            .json({
                success: true,
                message: "Logged in",
                loggedIn: true,
                userId: user._id,
                accessToken,  // The token sent in response body for testing (you can remove this in production)
                ...userData
            });
    }catch(err){
        console.log("Error in logging in: ", err)
        return res.status(500).json({success: false, message: "Server error in logging in"});
    }
}

export const logOut = (req, res) => {
    // in frontend wherever this endpoint is called, delete the accessToken
    const token = req.cookies?.token;
    // console.log("Cookies",req.cookies);
    // console.log("token",token);
    if (!token) {
        return res.status(401).json({ success: false, loggedIn:false, message: "Not logged in" });
    }

    try{
        res.clearCookie('token', {httpOnly: true, sameSite: "None", secure: true}) 
        return res.status(200).json({success: true, loggedIn: false, message: "User Successfully Logged out"});
    }catch(err){
        console.log("Error in User Log Out", err);
        return res.status(400).json({success: false, loggedIn: false, message: "Error in User Log Out"});
    }
};

export const postUser = async (req, res) => {
    const body = await req.body;

    //check if the email already exists
    const userExists = await User.findOne({email: body.email});
    if(userExists){
        console.log("User already exists")
        return res.status(400).json({success: false, message: "User already exists"});
    }

    try{
        const user = new User(body);
        user.save();
        
        console.log("User Created");
        return res.status(201)
            .json({
            success: true,
            message: "User Created"
        });
    }catch(err){
        console.log("Error in Fetching user data");
        return res.status(500).json({
            success: false, 
            message: "server error in fetching user data",
        });
    }
}

export const dashLogin = async (req, res) =>{
    const {email, password} = req.body;

    try{
        const user = await dashUser.findOne({email: email});
        if(!user){
            return res.status(401).json({success: false, message: "User not found"});
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        //Generate Token
        const token = jwt.sign({id: user._id, email: user.email, role: user.type}, SECRET_KEY);
        // const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        return res
            .status(200)
            .cookie('token', token)
            .json({success: true, message: "Logged in", token});
    }catch(err){
        console.log("Error in logging in: ", err)
        return res.status(500).json({success: false, message: "Server error in logging in"});
    }
}

export const getAllUser = async (req, res) =>{
    try{
        const body = await User.find({});
        res.status(201).json({success:true, message:body});
        console.log("User Details Fetched");
    }catch(err){
        res.status(500).json({success:false, message:"Server Error"});
        console.log("Error in Fetching User Details", err.message);
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
        const returned = await User.findById(id).populate(["cart.design", "cart.fabric", "wishlist.design", "wishlist.fabric"]);
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
        console.log("Error in Fetching user data", err.message);
    }
}   

export const deleteUser = async (req, res) => {
    const {id} = req.params;
    
    const userExists = await User.findById(id);
    if(!mongoose.Types.ObjectId.isValid(id)||!userExists){
        return res.status(404).json({
            success: false, 
            message: "User not found",
        });
    }

    try{
        await User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message:`User ${id} deleted`,
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
    const { id } = req.params;
    let body = req.body;

    // Default profile picture URL
    const DEFAULT_PROFILE_PIC = "https://res.cloudinary.com/dabeupfqq/image/upload/v1735668108/profile_sgelul.png";

    // Validate user existence
    const userExists = await User.findById(id);
    if (!mongoose.Types.ObjectId.isValid(id) || !userExists) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    try {
        // If a new file is uploaded
        if (req.file) {
            // Check if the existing profile picture is not the default value
            if (userExists.profilePic && userExists.profilePic.url && userExists.profilePic.url !== DEFAULT_PROFILE_PIC) {
                // Extract publicId from the existing profile picture URL
                const publicId = userExists.profilePic.url.split('/').pop().split('.')[0];
                try {
                    await cloudinary.uploader.destroy(`fabricatee_users/${publicId}`);
                    console.log("Previous profile picture deleted from Cloudinary.");
                } catch (deleteErr) {
                    console.error("Error deleting previous profile picture:", deleteErr);
                }
            }

            // Upload new profile picture to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: 'fabricatee_users',
            });

            // Remove the local file after uploading
            try {
                fs.unlinkSync(req.file.path);
                console.log("Temporary file removed.");
            } catch (unlinkErr) {
                console.error("Error deleting temporary file:", unlinkErr);
            }

            // Add new profile picture URL to the body
            body.profilePic = { url: uploadedImage.url };
        }

        // Update user with the new data
        await User.findByIdAndUpdate(id, body);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: body,
        });

        console.log(`User ${id} updated.`);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error in updating user data.",
        });

        console.error("Error updating user:", err);
    }
};
import mongoose from "mongoose";
import Order from "../models/orders.model.js";

export const getAllOrders = async (req, res) =>{
    try{
        const body = await Order.find({});
        res.status(201).json({success:true, message:body});
        console.log("Orders Fetched");
    }catch(err){
        res.status(500).json({success:false, message:"Server Error"});
        console.log("Error in Fetching Order Details");
    }
}

export const getOrder = async (req, res) => {
    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({
            success: false, 
            message: "order not found",
        });
    }
    
    
    try{
        const returned = await Order.findById(id);
        if(!returned) return res.status(404).json({
            success: false, 
            message: "order not found",
        });
        res.status(201).json({success:true, message:returned});
        console.log("Order Details Fetched");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in fetching order data",
        });
        console.log("Error in Fetching order data");
    }
}   

export const postOrder = async (req, res) => {
    const body = req.body;

    try{
        const order = new Order(body);
        order.save();
        res.status(201).json({
            success: true,
            message: body,
        })
        console.log("Order Created");
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in fetching order data",
        });
        console.log("Error in Fetching order data");
    }
}

export const deleteOrder = async (req, res) => {
    const {id} = req.params;
    
    const orderExists = await Order.findById(id);
    if(!mongoose.Types.ObjectId.isValid(id)||!orderExists){
        return res.status(404).json({
            success: false, 
            message: "order not found",
        });
    }

    try{
        await Order.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message:`Order ${id} deleted`,
        });
        console.log(`Order ${id} deleted`);
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in deleting order data",
        });
        console.log('Order Deletion - Error');
    }
}

export const putOrder = async (req, res) => {
    const {id} = req.params;
    const body = req.body;

    const orderExists = await Order.findById(id);
    if(!mongoose.Types.ObjectId.isValid(id)||!orderExists){
        return res.status(404).json({
            success: false, 
            message: "user not found",
        });
    }

    try{
        await Order.findByIdAndUpdate(id, body);
        res.status(200).json({
            success: true,
            message: body
        })
        console.log(`Order ${id} updated`);
    }catch(err){
        res.status(500).json({
            success: false, 
            message: "server error in updating order data",
        });
        console.log(`Error - Order not updated: ${err}`);
    }
}
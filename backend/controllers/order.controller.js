import mongoose from "mongoose";
import Order from "../models/orders.model.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import usersModel from "../models/users.model.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, price } = req.body;

    // Input validation
    if (!userId || !items || !price) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    // Validate price is a positive number
    if (price.total <= 0) {
      return res.status(400).json({
        message: "Invalid order amount",
        success: false,
      });
    }

    // Check if user exists before proceeding
    const user = await usersModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RZYPAY_ID,
      key_secret: process.env.RZYPAY_SECRET,
    });

    const options = {
      amount: Math.round(price.total * 100), // Ensure amount is rounded to avoid decimal issues
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    // Create Razorpay order
    const order = await instance.orders.create(options);

    // Create order in database
    const userOrder = await Order.create({
      userId,
      items,
      price,
      status: "Initiated",
      orderId: order.id,
    });

    return res.status(200).json({
      data: order,
      success: true,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    updatedCart,
  } = req.body;

  try {
    // Input validation
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId
    ) {
      return res.status(400).json({
        message: "Missing required payment verification fields",
        success: false,
      });
    }

    // Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RZYPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        message: "Invalid payment signature",
        success: false,
      });
    }

    // Find user and order
    const [user, order] = await Promise.all([
      usersModel.findById(userId),
      Order.findOne({ orderId: razorpay_order_id }),
    ]);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    // Update user cart and order status
    user.cart = updatedCart || [];
    order.status = "Confirmed - In Progress";
    order.paymentId = razorpay_payment_id;
    order.updatedAt = new Date();

    // Save changes
    await Promise.all([user.save(), order.save()]);

    return res.status(200).json({
      message: "Payment verification successfull",
      success: true,
      id: order._id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    const currOrder = await Order.findOne({ orderId: razorpay_order_id });
    currOrder.status = "Payment Failed";
    currOrder.save();
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const body = await Order.find({}).sort({ createdAt: -1 });
    res.status(201).json({ success: true, message: body });
    console.log("Orders Fetched");
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
    console.log("Error in Fetching Order Details");
  }
};

export const getOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "order not found",
    });
  }

  try {
    const returned = await Order.findById(id);
    if (!returned)
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    res.status(201).json({ success: true, message: returned });
    console.log("Order Details Fetched");
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error in fetching order data",
    });
    console.log("Error in Fetching order data");
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId: userId })
      .populate([{ path: "items.design" }, { path: "items.fabric" }])
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .send({ message: "user orders fetched", success: true, orders });
  } catch (error) {
    console.log("error in fetching user order details", error.message);
    return res.status(200).send({
      message: "Internal Server Error in Fetching User Orders",
      success: false,
    });
  }
};

export const postOrder = async (req, res) => {
  const body = req.body;

  try {
    const order = new Order(body);
    order.save();
    res.status(201).json({
      success: true,
      message: body,
    });
    console.log("Order Created");
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error in fetching order data",
    });
    console.log("Error in Fetching order data");
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "order not found",
    });
  }
  const orderExists = await Order.findById(id);
  if (!orderExists) {
    return res.status(404).json({
      success: false,
      message: "order not found",
    });
  }

  try {
    await Order.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `Order ${id} deleted`,
    });
    console.log(`Order ${id} deleted`);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error in deleting order data",
    });
    console.log("Order Deletion - Error");
  }
};

export const putOrder = async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try {
    const orderExists = await Order.findOne({ orderId: id });
    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    await Order.findByIdAndUpdate(orderExists._id, body);
    res.status(200).json({
      success: true,
      message: body,
    });
    console.log(`Order ${id} updated`);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error in updating order data",
    });
    console.log(`Error - Order not updated: ${err}`);
  }
};

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderId: { type: String, unique: true, required: true },
    items: [
      {
        design: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Design",
          required: true,
        },
        fabric: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Fabric",
          required: true,
        },
        measurementProfile: {
          chest: { type: String, required: false },
          waist: { type: String, required: false },
          hips: { type: String, required: false },
          length: { type: String, required: false },
          shoulders: { type: String, required: false },
          sleeves: { type: String, required: false },
        },
        quantity: { type: Number, default: 1 },
        price: {
          fabric: { type: Number, required: true },
          stitching: { type: Number, required: true },
        },
      },
    ],
    price: {
      totalmrp: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      coupondiscount: {
        amt: Number,
        coupon: String,
      },
      delivery: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    trackingDetails: {
      deliveryPartner: {
        type: String,
        required: false,
      },
      trackingID: {
        type: String,
        required: false,
      },
      trackingLink: {
        type: String,
        required: false,
      },
    },
    status: {
      type: String,
      enum: [
        "Initiated",
        "Payment Failed",
        "Confirmed - In Progress",
        "Ready for Dispatch",
        "In Transit",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (!this.customId) {
    const timestamp = Date.now().toString(36); // Base36 timestamp
    const random = Math.random().toString(36).substring(2, 8); // Random string
    this.customId = `ORD-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);

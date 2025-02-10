import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const itemSchema = new mongoose.Schema({
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
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, default: "NA" },
    password: { type: String, required: true },
    address: [
      {
        name: { type: String, required: true },
        line1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: Number, required: true },
      },
    ],
    measurements: {
      type: Map,
      of: new mongoose.Schema({
        name: { type: String, required: true },
        dimensions: {
          type: Map,
          of: Number,
          required: true,
        },
      }),
    },
    wishlist: { type: [itemSchema], default: [] },
    cart: {
      type: [itemSchema],
      default: [],
    },
    role: {
      type: String,
      enum: ["admin", "vendor", "tailor", "designer", "user"],
      default: "user",
      require: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(new Error("Password encryption failed. Please try again."));
  }
});

// Instance method for password validation
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);

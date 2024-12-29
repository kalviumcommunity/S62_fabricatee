import mongoose from "mongoose";

const fabricSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    blend: { type: String, required: false },
    tags: [{ type: String, required: false }], // For filtering
    meterprice: { type: Number, required: true },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DashUser',
        required: false,
    }
}, {timestamps: true});

export default mongoose.model('Fabric', fabricSchema);

import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    tags: [{ type: String, required: false }], // For filtering
    meterprice: { type: Number, required: true },
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            alt: {
                type: String,
                required: false,
            }
        }
    ],
    designerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DashUser',
        required: false,
    }
}, {timestamps: true});

export default mongoose.model('Design', designSchema);
import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    tags: [{ type: String, required: false }], // For filtering
    stitching: [{mrp:{ type: Number, required: false, default: 0 }, sp: { type: Number, required: false, default: 0 }, cp:{ type: Number, required: false, default: 0 }}],
    commision: { type: Number, required: false, default: 0 },
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
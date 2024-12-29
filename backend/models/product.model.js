import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    design: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Design',
        required: true,
    },
    fabric: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fabric',
        required: true,
    },
    // accessories: {
    //     type: [String], // Optional accessories
    //     required: false,
    // },
    measurementProfile: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: false,
        default: 1,
    }
}, {timestamps: true});

export default mongoose.model("Product", productSchema);
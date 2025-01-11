import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    orderId:{ type: String, unique: true, required: true },
    items: [
    {    
        design: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Design',
            required: true,
        },
        fabric: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fabric',
            required: true,
            //bcrypt
        },
        // accessories: {
        //     type: [String], // Optional accessories
        //     required: false,
        // },
        measurementProfile: {
            type: String, // Key referencing the measurement profile
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        price: {
            fabric: {
                type: Number,
                required: true,
            },
            stitching: {
                type: Number,
                required: true,
            }
        }
    }
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
        tax: {
            type: Number,
            required: true,
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
            required: false
        },
        trackingID: {
            type: String,
            required: false
        },
        trackingLink: {
            type: String,
            required: false
        },
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Quality Check', 'Ready for Dispatch', 'In Transit', 'Shipped', 'Out for Delivery', 'Delivered'],
        default: 'Pending',
    }
}, {timestamps: true});

orderSchema.pre('save', function (next) {
    if (!this.customId) {
        const timestamp = Date.now().toString(36); // Base36 timestamp
        const random = Math.random().toString(36).substring(2, 8); // Random string
        this.customId = `ORD-${timestamp}-${random}`; 
    }
    next();
});

export default mongoose.model("Order", orderSchema);
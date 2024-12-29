import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false , unique: false},
    password: { type: String, required: true},
    address: {
        type: Map,
        of: new mongoose.Schema(
            {
                name: {type: String, required: true},
                address: {
                    type: Map,
                    of: new mongoose.Schema({
                        line1: { type: String, required: false },
                        line2: { type: String, required: false },
                        city: { type: String, required: false },
                        state: { type: String, required: false },
                        pincode: { type: Number, required: false },
                    }),
                    required: true
                }
            }
        ),
        required: false
    }
    ,
    measurements: {
        type: Map,
        of: new mongoose.Schema({
            name: { type: String, required: true }, // Profile name
            dimensions: {
                type: Map,
                of: Number, // Key-value pairs for measurements
                required: true,
            },
        }),
        required: false,
    },
    wishlist: [{
        type: mongoose.Schema.ObjectId,
        ref:"Product",
        required: false
    }],
    cart: [{
        type: mongoose.Schema.ObjectId,
        ref:"Product",
        required: false
    }],
    orders: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Order"
        }
    ],
    profilePic: {
        url: {type: String, require: false},
        alt: {type: String, require: false}
    }
}, {timestamps: true});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Password Encrypted");
    }catch(err){
        console.log("Password encryption error");
    }
    next();
})

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('User', userSchema);
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'

const dashUserSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    phoneNo: {type: String, require: false},
    type: {
        type: String,
        enum: ['Admin', 'Vendor', 'Tailor', 'Designer'],
        require: true,
    },
    profilePic: {
        url: {type: String, require: false},
        alt: {type: String, require: false}
    }
}, {timestamps: true});

dashUserSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        console.log("Password Hashed");
    }catch(err){
        console.log("Error in Password Hashing");
    }
})

export default mongoose.model("DashUser", dashUserSchema);
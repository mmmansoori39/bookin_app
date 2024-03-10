import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserType } from '../shared/types';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, unique: true },
    firstName: { type: String, unique: true },
    lastName: { type: String, unique: true },
})

userSchema.pre("save", async function (next) {
    try {
        if(this.isModified('password')){
            const salt = await bcrypt.genSalt(8);
            this.password = await bcrypt.hash(this.password || '', salt);
        }
        next();
    } catch (error) {
        console.log(error)
    }
})


const User = mongoose.model<UserType>("User", userSchema);

export default User;
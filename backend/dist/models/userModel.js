import mongoose, { Schema, Document, Types } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: [254, "Email is too long"],
        validate: {
            validator: (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
            message: "Please enter a valid email address",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [128, "Password is too long"],
        validate: {
            validator: (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]).{8,}$/.test(password),
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user",
    },
}, {
    timestamps: true,
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=userModel.js.map
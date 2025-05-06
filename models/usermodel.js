import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";  // Import the validator package

// Define schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
}, { 
    timestamps: true,
    collection: "users",
});

// STATIC METHOD: register a new user
userSchema.statics.register = async function (name, email, password, role) {
    try {
        // Validate email and password
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email format.");
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
            throw new Error("Password must be at least 8 characters long and include one letter, one number, and one special character.");
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const user = new this({
            name,
            email,
            password: hashedPassword,
            role,
        });

        if (role !== "admin" && role !== "user") {
            throw new Error("Invalid role. Role must be either 'admin' or 'user'.");
        }

        // Check if user already exists
        const existingUser = await this.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists with this email.");
        }

        const newUser = await user.save();
        return newUser;
    }
    catch (error) {
        throw new Error("Error registering user: " + error.message);
    }
};

// STATIC METHOD: get all users
userSchema.statics.getUser = async function (email) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error("User not found.");
        }
        return user;
    }
    catch (error) {
        throw new Error("Error fetching user: " + error.message);
    }
};

userSchema.statics.login = async function (email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password.");
        }

        // Compare the password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password.");
        }

        return user;
    }
    catch (error) {
        throw new Error("Error logging in: " + error.message);
    }
};

userSchema.statics.renewToken

// Export model
const User = mongoose.model("User", userSchema);
export default User;

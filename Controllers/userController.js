import userModel from '../models/usermodel.js';
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;  // Replace with env variable in production


const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // Destructure request body
        const user = await userModel.register(name, email, password, role); // Register the user
        res.status(201).json({ message: 'User registered successfully', user }); // Send success response
    } catch (error) {
        res.status(400).json({ message: error.message }); // Send error response
    }
}



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Destructure request body
        const user = await userModel.login(email, password); // Login the user

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email },  // Payload contains the user's email
            JWT_SECRET,
            { expiresIn: "20m" }     // Token expires in 20minutes
        );

        res.status(200).json({ 
            message: 'User logged in successfully',
            token,  // Send the token in response
        }); // Send success response
    } catch (error) {
        res.status(401).json({ message: error.message }); // Send error response
    }
}

const renewToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again' });
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }

        if (!decoded || !decoded.email) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        const user = await userModel.getUser(decoded.email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newtoken = jwt.sign(
            { email: user.email },
            JWT_SECRET,
            { expiresIn: "20m" }
        );

        res.status(200).json({
            message: 'Token renewed successfully',
            token: newtoken,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getUserProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization; // Get authorization header
        if (!authHeader|| !authHeader.startsWith('Bearer ')) { // Check if header is present and starts with 'Bearer '
            return res.status(401).json({ message: 'Authorization token is required' }); // Send error response if header is missing
        }

        const token = authHeader.split(' ')[1]; // Extract token from header
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
        if(!decoded|| !decoded.email) { // Check if token is valid and contains email
            return res.status(401).json({ message: 'Invalid token' }); // Send error response if token is invalid
        }

        const user = await userModel.getUser(decoded.email); // Get user from database using email from token
        if (!user) { // Check if user exists
            return res.status(404).json({ message: 'User not found' }); // Send error response if user is not found
        }

        res.status(200).json({ // Send success response with user data
            message: 'User profile fetched successfully',
            user: {
                name: user.name,
            },
        });

    } catch (error) {
        res.status(400).json({ message: error.message }); // Send error response
    }
}


export { registerUser, loginUser, getUserProfile, renewToken }; // Use named exports for ES Modules
import { registerUser, loginUser, getUserProfile, renewToken } from '../Controllers/userController.js'; // Import user controller functions
import express from 'express';
const router = express.Router(); // Create a new router instance

router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser); // Route for user login
router.get('/profile', getUserProfile);
router.post('/renew-token', renewToken); // Route for renewing token

export default router; // Export the router for use in other files
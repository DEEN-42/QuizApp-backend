import { getAllQuizData, createQuiz } from "../Controllers/quizController.js";
import express from "express"; // Import express framework
import authMiddleware from "../middleware/AuthenticationMiddleware.js";
const router = express.Router(); // Create a new router instance

router.get("/",authMiddleware, getAllQuizData); // Route to get all quiz data by email
router.post("/", authMiddleware, createQuiz); // Route to create a new quiz
export default router; // Export the router for use in other files
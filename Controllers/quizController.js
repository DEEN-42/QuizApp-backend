import quizmodel from "../models/quizmodel.js"; // Import quiz model

//function to get all quiz data by email
const getAllQuizData = async (req, res) => {
    try {
        const email = req.email; // Get email from request parameters
        if (!email) {
            return res.status(400).json({ message: "Email is required to fetch quizzes." }); // Send error response if email is missing
        }
        const quizzes = await quizmodel.getAllQuizData(email); // Fetch quizzes from database using email
        res.status(200).json(quizzes); // Send success response with quizzes data
    } catch (error) {
        res.status(500).json({ message: error.message }); // Send error response
    }
}

//create a new quiz
const createQuiz = async (req, res) => {
    try {
        const email = req.email; // Get decoded email from auth middleware

        if (!email) {
            return res.status(400).json({ message: "Email is required to create a quiz." });
        }

        const quizData = req.body; 

        const quiz = await quizmodel.createQuiz(email, quizData);

        res.status(201).json(quiz); // Return the created quiz
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: error.message });
    }
};


export { getAllQuizData , createQuiz }; // Export functions for use in other files
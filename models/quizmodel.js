import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    quizElements: {
        data: {
            questions: [{
                question: { type: String, required: true },
                options: [{ type: String, required: true }],
                correctAnswer: { type: Number, required: true }
            }]
            // Removed correctAnswers and options arrays from here since they are inside questions
        }
    },
    answers: [{ type: Number }],  // you were storing numbers (indices), not strings
    allocatedTime: { type: Number },
    elapsedTime: { type: Number },
    registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });



//get all quiz data by email
quizSchema.statics.getAllQuizData = async function (email) {
  try {
    if (!email) {
        throw new Error("Email is required to fetch quizzes.");
    }
    const quizzes = await this.find({ email });
    // if (!quizzes || quizzes.length === 0) {
    //   throw new Error("No quizzes found for this email.");
    // }
    return quizzes;
    }
    catch (error) {
        throw new Error("Error fetching quizzes: " + error.message);
        }
}

//create a new quiz
quizSchema.statics.createQuiz = async function (email, quizData) {
    // Find the user by email (which is decoded from the token)
    const user = await mongoose.model('User').findOne({ email });

    if (!user) {
        throw new Error("User not found.");
    }

    // Destructure the quiz data passed from the client
    const {
        questions,
        answers,
        allocatedTime,
        elapsedTime,
    } = quizData;

    // Create the quiz document with the provided data and register timestamp
    const quiz = new this({
        name: user.name,
        email: user.email,
        quizElements: {
            data: {
                questions: questions || [],           // Ensure an empty array if no questions
                correctAnswers: answers || [],        // Assuming answers hold correct answers
                options: questions.map(() => []),     // Assuming empty options array for now
            }
        },
        answers: answers || [],
        allocatedTime: allocatedTime || 0,  // Set a default or from quizData
        elapsedTime: elapsedTime || 0,      // Set a default or from quizData
        registeredAt: new Date()             // Set the current time as the registration time
    });

    // Save the quiz
    await quiz.save();

    return quiz;
};


export default mongoose.model('Quiz', quizSchema);


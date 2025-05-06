import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // import dotenv to load environment variables
dotenv.config(); // load environment variables from .env file
import { connectToDatabase } from './db.js';


const app = express();

app.use(cors());
import fileuploading from './routes/fileuploading.js'; // import the fileuploading route
import questionnaire from './routes/questionnaire.js'; // import the questionnaire route
import userRoute from './routes/userRoute.js'; // import the user route
import quizRoute from './routes/quizRoute.js'; // import the quiz route


import aichat from './routes/aichat.js'; // import the aichat route
const PORT = process.env.PORT;

app.use(cors()); // allow requests from frontend


connectToDatabase();

app.use(express.json());
app.use('/users', userRoute); // use the user route for user registration and login
app.use('/fileuploading', fileuploading); // use the fileuploading route for file uploads
app.use('/questionnaire', questionnaire); // use the questionnaire route for questionnaire data
app.use('/aichat', aichat); // use the aichat route for AI chat
app.use('/quizzes', quizRoute); // use the quiz route for quiz data


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

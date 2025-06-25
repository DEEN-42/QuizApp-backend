
# 📚 QuizApp Backend

This is the **backend** repository for the [Document-Based Quiz Generator](https://github.com/DEEN-42/QuizApp-frontend), a full-stack web application that enables users to upload documents, automatically generate quizzes, and track their learning progress. This backend is built using **Node.js**, **Express**, and **MongoDB**, with secure authentication and API endpoints for quiz handling and user management.

---

## 🔗 Live Deployment

- 🌐 Backend: [https://quizapp-backend-bqes.onrender.com](https://quizapp-backend-bqes.onrender.com)
- 💻 Frontend Repository: [QuizApp Frontend](https://github.com/DEEN-42/QuizApp-frontend)

---

## 🚀 Features

- 📄 **Document Upload**: Accepts documents (PDFs, DOCX, etc.) for quiz generation.
- 🧠 **Quiz Generation**: Automatically generates quiz questions from uploaded content using an AI model.
- 📊 **Progress Tracking**: Stores user quiz attempts, scores, and time spent.
- 🔐 **Authentication**: User login and signup using **bcrypt** for password hashing and **JWT** for session management.
- 📜 **Quiz History**: View previous quizzes along with correct answers and user responses.
- 🤖 **AI Chat Assistant**: Enables contextual Q&A to help users learn better.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: bcrypt, JSON Web Tokens (JWT)
- **File Handling**: `multer` for file uploads
- **Deployment**: Render

---

## 📦 Installation & Setup

1. **Clone the repository**:
```bash
   git clone https://github.com/DEEN-42/QuizApp-backend.git
   cd QuizApp-backend
````

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` file**:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

---


> Use JWT Bearer token in headers for protected routes.

---

## 🧠 AI Integration

Quiz generation and AI chat features are powered by external AI APIs, allowing contextual question creation and user support during quiz attempts.

---

## 📌 Notes

* This is only the **backend** repo. The complete frontend is developed separately and available [here](https://github.com/DEEN-42/QuizApp-frontend).
* CORS is enabled to allow frontend-backend communication.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Feel free to fork and contribute to improve the project. Open issues or submit PRs!

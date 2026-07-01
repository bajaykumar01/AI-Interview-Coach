# 🎯 AI Interview Coach

An intelligent AI-powered Interview Preparation Platform that helps students and job seekers practice technical interviews through personalized questions, instant AI evaluation, resume-based interviews, and detailed performance analytics.

---

## 🚀 Features

### 🔐 User Authentication

* User Registration
* Secure Login using JWT Authentication
* Password Encryption using Bcrypt

### 📄 Resume-Based Interview

* Upload Resume (PDF)
* Automatic Resume Text Extraction
* AI analyzes resume using Gemini API
* Extracts:

  * Skills
  * Professional Summary
  * Recommended Job Role
* Generates personalized interview questions based on the candidate's resume.

### ⚙️ Configurable Interview

Users can customize interviews by selecting:

* Job Role
* Difficulty Level (Easy / Medium / Hard)

The AI dynamically generates technical interview questions.

### 🤖 AI Question Generation

Powered by **Google Gemini 2.5 Flash API**

Features:

* Dynamic question generation
* Adaptive questioning
* Difficulty adjustment based on candidate performance

### 🎤 Speech-to-Text Interview

Candidates can answer questions using voice.

Features:

* Speech Recognition
* Real-time Voice Input
* Hands-free Interview Experience

### 📝 AI Answer Evaluation

Every answer is evaluated using Gemini AI.

AI provides:

* Score (0–10)
* Personalized Feedback
* Technical Evaluation

### 📊 AI Performance Report

After completing the interview, AI generates a detailed report including:

* Overall Score
* Technical Accuracy
* Communication Rating
* Confidence Rating
* Strengths
* Weak Topics
* Recommended Learning Topics
* Personalized Suggestions

### 📈 Dashboard & Analytics

Interactive dashboard showing:

* Total Interviews
* Average Score
* Best Score
* Score History
* Resume Information
* Interview Mode Distribution

### 🎨 Modern Interactive UI

Built with:

* React
* Tailwind CSS
* Framer Motion

Features:

* Beautiful Landing Page
* Responsive Design
* Smooth Animations
* Modern Dashboard
* Interactive Charts

---

# 🏗️ Project Architecture

Frontend (React + Tailwind CSS)

↓

FastAPI Backend

↓

Gemini API (Question Generation & Evaluation)

↓

MySQL Database

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* Framer Motion
* Recharts

## Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* Passlib (Bcrypt)
* Python-Jose

## AI

* Google Gemini 2.5 Flash API

## Database

* MySQL

## Other Libraries

* PyPDF
* Python-dotenv
* Python Multipart

---

# 📂 Project Structure

```
AI-Interview-Coach
│
├── frontend
│   ├── src
│   ├── pages
│   ├── components
│   └── services
│
├── app
│   ├── routers
│   ├── crud.py
│   ├── database.py
│   ├── gemini.py
│   ├── models.py
│   ├── schemas.py
│   └── security.py
│
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Interview-Coach.git

cd AI-Interview-Coach
```

---

## Backend Setup

```bash
cd app

python -m venv .venv

source .venv/bin/activate
```

Windows

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn app.main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

DATABASE_URL=mysql+pymysql://username:password@localhost/database_name
```

---

# 📸 Screenshots

Add screenshots of:

* Landing Page
* Login Page
* Dashboard
* Resume Upload
* Interview Screen
* AI Report
* History Page

---

# 🎯 Future Enhancements

* Video Interview Support
* Emotion Detection
* AI Resume Improvement Suggestions
* Company-Specific Interview Preparation
* Mock HR Interviews
* Multi-language Support
* AI Coding Interview Module
* Leaderboard & Gamification

---

# 💡 Key Highlights

* Resume-Based Personalized Interviews
* Adaptive AI Question Generation
* Speech-to-Text Support
* AI Performance Analytics
* Secure Authentication
* Modern Responsive UI
* Gemini AI Integration
* Real-Time Feedback

---

# 👨‍💻 Author

**Ajay Bhoga**

Bachelor of Technology (Computer Science)

Interested in:

* Artificial Intelligence
* Machine Learning
* Full Stack Development
* Backend Engineering

---

# 📜 License

This project is developed for educational and learning purposes.

# 🤖 AI Test Plan Generator with Jira Integration

Welcome! This project is an intelligent tool designed to make the life of software testers and developers easier. 

## 🚀 What is this?
Imagine you have a list of features you need to build (in Jira) and you need to verify they work correctly. Usually, a human has to sit down, read every requirement, and write a detailed document (a Test Plan) listing every single test case. This takes hours or even days.

**This tool does that for you in minutes.**

## ✨ How does it work?
It acts like a smart assistant that follows 4 simple steps:

1.  **API Setup**: You tell it where your software is running (the URL).
2.  **Jira Connect**: You connect it to your Jira board so it can "read" what you are building.
3.  **AI Config**: You choose which "Brain" to use (like OpenAI's GPT-4 or a local Ollama model).
4.  **Generate**: It thinks for a moment and writes a professional, production-ready Test Plan with all the test cases you need.

## 🎯 Why use it?
*   **Save Time**: What used to take days now takes minutes.
*   **Consistency**: The AI ensures every requirement is covered, no missing gaps.
*   **Quality**: It writes detailed steps, including what to test, how to test it, and what the expected result should be.

---

## 🛠️ How to Run It

This application has two parts: the **Backend** (the brain) and the **Frontend** (the user interface).

### Prerequisites
*   Node.js (for the frontend)
*   Python (for the backend)

### 1. Start the Backend (The Brain)
Open a terminal in the `backend` folder and run:
```bash
# Install dependencies (only needed once)
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```
*The backend will start running at `http://localhost:8000`*

### 2. Start the Frontend (The Interface)
Open a new terminal in the `frontend` folder and run:
```bash
# Install dependencies (only needed once)
npm install

# Start the app
npm run dev
```
*The frontend will start running at `http://localhost:5173`. Open this link in your browser to start!*

---
*Created with ❤️ by the AI Blueprint Team*

# AgentAI — AI-Powered Career Assistant 🚀

AgentAI is a full-stack, AI-integrated web application designed to help job seekers discover roles, internships, and hackathons tailored specifically to their skills. By utilizing a local **Ollama (llama3.2)** LLM, the platform analyzes user resumes, extracts core competencies, and drives a highly context-aware conversational assistant to recommend personalized career paths.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Ollama](https://img.shields.io/badge/Ollama-111111?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 🌟 Core Features

1. **AI Resume Parsing**: Users upload their PDF resume, and AgentAI leverages local AI inference to instantly extract skills, education, projects, and career domains.
2. **Context-Aware Chatbot**: 
   - A personalized chat interface powered by `llama3.2`. 
   - Retains conversation history throughout the session.
   - Aware of the candidate's parsed profile, enabling highly specific advice and job matching.
3. **Sleek UI/UX Redesign**: Built with React & Vite, featuring a responsive, modern dark-theme UI with micro-animations, glassmorphism, and dynamic message bubbles.
4. **Privacy-First Local AI**: All AI processing runs completely locally through Ollama, meaning user resumes are never sent to third-party cloud endpoints.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React + Vite
- **Styling**: Vanilla CSS (Responsive, Design Tokens, Custom Animations)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Network**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: Ollama (llama3.2 model)
- **Uploads**: Multer (for handling PDF resumes)
- **PDF Parsing**: `pdf-parse`

---

## 📂 Project Structure

```
AgentAI/
├── backend/
│   ├── config/             # DB and Environment config
│   ├── controllers/        # Request handlers (chatController, uploadController)
│   ├── routes/             # Express routes (chatRoutes, uploadRoutes)
│   ├── services/           # Business logic (chatService, ollamaService, resumeParser)
│   ├── uploads/            # Temporary storage for uploaded resumes
│   └── server.js           # Backend entry point
├── src/
│   ├── components/         # React UI Components (LandingPage, ChatPage, etc.)
│   ├── services/           # Frontend API hooks (api.js)
│   ├── App.jsx             # Main App Router & State Management
│   ├── App.css             # Semantic Component Styles
│   └── index.css           # Global Design System (Tokens, Animations)
├── .env                    # Environment variables
└── package.json            # Scripts and dependencies
```

---

## 🚀 Getting Started

### Prerequisites
1. **Node.js**: `v18+` recommended.
2. **Ollama**: Download and install [Ollama](https://ollama.com/).
3. **Model**: Pull the `llama3.2` model by running:
   ```bash
   ollama pull llama3.2
   ```

### 1. Start the Backend
The backend runs on port 5000 and orchestrates the AI integration.
```bash
cd backend
npm install
node server.js
```
*Health Check*: Navigate to `http://localhost:5000/api/chat/health` to verify the connection to Ollama.

### 2. Start the Frontend
The frontend runs via Vite on port 5173/5174.
```bash
# In the project root directory
npm install
npm run dev
```

### 3. Using the Platform
- Navigate to `http://localhost:5173/` in your browser.
- Enter your details and upload a PDF resume.
- Wait for the AI to parse the document.
- Start chatting with the AgentAI assistant to discover customized career opportunities!

---

## 🔒 Environment Variables
Ensure you have `.env` configured inside your `backend` directory. Example:
```env
PORT=5000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

---

## 🤝 Contribution Guidelines
This project enforces clean code practices:
- All external API calls should be encapsulated within the `services/` directory.
- Avoid passing massive prop chains; utilize centralized state when scaling.
- Ensure all AI network calls are wrapped in robust `try/catch` handlers with meaningful error responses.

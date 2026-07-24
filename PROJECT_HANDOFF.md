# AgentAI Complete Project Handoff

## 1. Project Overview
- **Project name**: AgentAI
- **Objective**: Create an AI Career Assistant that parses candidate resumes and provides interactive, context-aware career guidance, job recommendations, and skill matching.
- **Problem statement**: Job seekers often need personalized guidance based on their specific background, which generic chatbots cannot provide without deep context. 
- **Overall workflow**: 
  1. User uploads a resume (PDF).
  2. Backend parses the PDF to text.
  3. Backend sends text to local Ollama (Llama 3.2) to extract structured JSON (name, skills, education, etc.).
  4. User enters the Chat UI where they can ask career questions.
  5. Chat backend sends user message, chat history, and the structured resume profile to Ollama to generate context-aware advice.
- **Main features**: Resume Upload & Parsing, AI Chatbot (Context-Aware), System Health Checks.
- **Current development stage**: Early-to-mid MVP.
- **What has been completed**: Frontend UI (React + Vite), Basic Routing, PDF Parsing, Local Ollama Integration for JSON Extraction & Chatting, Express Backend setup.
- **What is partially completed**: The Ollama extraction logic returns a string that needs to be properly parsed into a JSON object on the frontend/backend. Chat context history management is basic.
- **What is not started**: MongoDB Database integration, User Authentication, persistent chat history, proper UI loading states for file uploads, Job/Internship APIs, Calendar tracking, Dashboard analytics.

---

## 2. Architecture
The architecture is a classic MERN stack (currently minus MongoDB) combined with a local LLM.

- **Frontend**: React 19 (Vite) for UI, React Router for navigation, Axios for API calls.
- **Backend**: Node.js + Express for API routing and file handling (Multer).
- **Database**: Planned for MongoDB (currently `config/db.js` is empty).
- **AI Layer**: Local Ollama running the `llama3.2` model.
- **External APIs**: None currently. Completely local architecture.

### Data Flow (Request-Response)
1. **User** types a message in React Chat UI.
2. **React** calls `POST /api/chat` via Axios, passing `{ message, candidateProfile, history }`.
3. **Express** (`chatController.js`) receives it and calls `chatService.js`.
4. **chatService.js** formats a system prompt containing the profile and history, then sends a request to `http://localhost:11434/api/generate`.
5. **Ollama** runs inference using `llama3.2` and returns a text response.
6. **Express** formats the response into `{ success: true, reply: "..." }`.
7. **React** receives the reply and updates the chat state.

---

## 3. Folder Structure
```text
AgentAI/
├── backend/
│   ├── config/            # DB Configuration (db.js)
│   ├── controllers/       # Route logic (chatController.js, uploadController.js)
│   ├── middleware/        # Express middleware (uploadMiddleware.js)
│   ├── models/            # Mongoose models (currently empty)
│   ├── routes/            # API Route definitions (chatRoutes.js, uploadRoutes.js)
│   ├── services/          # Business logic and external API calls (chatService.js, ollamaService.js, resumeParser.js)
│   ├── uploads/           # Temp storage for uploaded PDFs
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express entry point
├── src/
│   ├── assets/            # Static assets
│   ├── components/        # React Components (ChatPage, LandingPage, etc.)
│   ├── services/          # Frontend API calls (api.js)
│   ├── App.jsx            # Main React component
│   ├── App.css            # Global Styles
│   ├── index.css          # CSS resets/globals
│   └── main.jsx           # React entry point
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
└── index.html             # HTML template
```

---

## 4. Frontend Status
- **Routes**: Configured in `App.jsx` (or similar). Uses React Router.
- **State Management**: Local component state (React hooks: `useState`, `useEffect`).
- **API calls**: Centralized in `src/services/api.js`.

### Components
1. **LandingPage.jsx**
   - **Purpose**: Entry point. Explains the product. Likely has the upload resume functionality.
   - **Status**: Mostly UI complete.
2. **ChatPage.jsx**
   - **Purpose**: Main container for the chatbot.
   - **Status**: Implemented. Holds chat history state.
3. **ChatWindow.jsx**
   - **Purpose**: Displays the list of messages between User and AI.
   - **Status**: Implemented.
4. **ChatInput.jsx**
   - **Purpose**: Text input and send button.
   - **Status**: Implemented.
5. **ChatHeader.jsx**
   - **Purpose**: Top navigation for the chat view. Shows system health or candidate name.
   - **Status**: Implemented.
6. **OpportunityCard.jsx**
   - **Purpose**: UI component to display recommended jobs/internships.
   - **Status**: Basic UI implemented, pending actual real-world API data.

---

## 5. Backend Status
- **server.js**: Entry point. Sets up CORS, JSON body parsers, and mounts routes.
- **routes/chatRoutes.js**: Maps `/api/chat` and `/api/chat/health` to controllers.
- **routes/uploadRoutes.js**: Maps `/api/upload` to the upload controller using Multer middleware.
- **controllers/chatController.js**: Handles validation, error handling, and formats Ollama responses.
- **controllers/uploadController.js**: Orchestrates the parsing of PDFs and sending text to Ollama for JSON extraction.
- **services/chatService.js**: Builds prompts and talks to Ollama for conversation.
- **services/ollamaService.js**: Talks to Ollama specifically for resume JSON extraction.
- **services/resumeParser.js**: Uses `pdf-parse` to convert PDFs to text.
- **models/**: Completely empty. No DB schemas yet.
- **middleware/uploadMiddleware.js**: Likely configuring Multer to save to `uploads/`.

---

## 6. MongoDB Status
**Currently NOT implemented.**
- **Collections**: None.
- **Schemas**: None.
- **Relationships**: None.
- **Current stored data**: None (everything is in-memory on the React side).
- **Pending collections**: Will need `Users`, `Conversations`, `Jobs`, etc.

---

## 7. Ollama Integration
- **How it's connected**: Backend uses Axios to make POST requests to `http://localhost:11434/api/generate`.
- **Model used**: `llama3.2`
- **Prompt flow**: 
  1. *Extraction*: Send raw resume text -> ask for strict JSON.
  2. *Chat*: Combine JSON profile + history array + new message -> ask for plain text response.
- **Response parsing**:
  - Chat responses are read directly from `response.data.response`.
  - JSON extraction is returned as a string that might contain markdown backticks (e.g., ` ```json { ... } ``` `), which could break if not sanitized properly on the frontend.
- **Error handling**: Checks if Ollama is reachable and if the model is installed (`/api/tags`). Returns graceful error messages to the frontend.
- **Known bugs**: The JSON extraction might occasionally fail if Ollama returns extra text outside the JSON structure.

---

## 8. APIs

### 1. Upload Resume
- **Method**: POST
- **Route**: `/api/upload`
- **Purpose**: Upload PDF, parse text, extract structured profile via AI.
- **Request body**: `multipart/form-data` (key: `resume`)
- **Response body**: `{ message, filename, profile }`
- **Frontend file calling it**: `api.js` (`uploadResume`)
- **Backend file handling it**: `uploadController.js`

### 2. Send Chat Message
- **Method**: POST
- **Route**: `/api/chat`
- **Purpose**: Generate context-aware AI response.
- **Request body**: `{ message, candidateProfile, history }`
- **Response body**: `{ success, reply }`
- **Frontend file calling it**: `api.js` (`sendChatMessage`)
- **Backend file handling it**: `chatController.js`

### 3. Check Health
- **Method**: GET
- **Route**: `/api/chat/health`
- **Purpose**: Verify backend and Ollama connectivity.
- **Request body**: None
- **Response body**: `{ status, ollama, detail }`
- **Frontend file calling it**: `api.js` (`checkHealth`)
- **Backend file handling it**: `chatController.js`

---

## 9. Dependencies

**Frontend packages (`package.json`)**:
- `react`, `react-dom`: UI library.
- `react-router-dom`: Routing.
- `axios`: API calls.
- `lucide-react`: Icons.
- `vite`: Build tool.

**Backend packages (`backend/package.json`)**:
- `express`: Server framework.
- `cors`: Cross-Origin Resource Sharing.
- `dotenv`: Environment variables.
- `axios`: Calls to Ollama.
- `multer`: File uploads handling.
- `pdf-parse`: PDF text extraction.

---

## 10. Environment Variables
No `.env` files are fully populated in the repository yet.
Required `.env` for Backend:
- `PORT=5000` (Port for express server)
- `OLLAMA_URL=http://localhost:11434` (Base URL for Ollama)
- `OLLAMA_MODEL=llama3.2` (Model to use)
- `MONGO_URI=` (Required once DB is added)

---

## 11. Commands

- **Install Frontend**: `npm install` (in root)
- **Install Backend**: `cd backend && npm install`
- **Run Frontend**: `npm run dev`
- **Run Backend**: `node server.js` (or `npx nodemon server.js`)
- **Run Ollama**: `ollama serve` (ensure `ollama run llama3.2` has been run once to download the model).

---

## 12. Current Issues

| Issue | Reason | Affected Files | Priority | Possible Fix |
|-------|--------|----------------|----------|--------------|
| JSON parsing failure | LLM might wrap JSON in markdown | `ollamaService.js` / Frontend | High | Use regex to extract JSON between `{}` or backticks before parsing. |
| No Data Persistence | MongoDB not connected | Entire App | High | Setup mongoose schemas and connect in `db.js`. |
| Upload Timeout | Local LLMs take time to process large PDFs | `api.js`, `uploadController.js` | Medium | Add robust loading spinners and consider streaming the response. |

---

## 13. Remaining Tasks
- [ ] Connect MongoDB and define User/Chat schemas.
- [ ] Implement user authentication (JWT).
- [ ] Save chat history to the database.
- [ ] Add loading skeletons/spinners for resume upload.
- [ ] Implement strict JSON sanitization for resume extraction.
- [ ] Integrate real APIs for job/internship searching (e.g., LinkedIn API, Jooble).
- [ ] Build the User Dashboard to view saved opportunities.

---

## 14. Important Logic
- **Resume Analysis**: Handled by `backend/services/ollamaService.js`. It forces the LLM to output a specific JSON structure representing the candidate.
- **Chatbot Context**: Handled by `backend/services/chatService.js`. It merges the extracted JSON profile, the user's current message, and the previous chat history into a single large system prompt, making the LLM "aware" of the user's skills.

---

## 15. Testing Status
- **What is working**: The server boots up, PDF parsing works, connecting to Ollama works. Frontend builds successfully.
- **What is failing**: Unknown edge cases in LLM parsing. 
- **How to reproduce bugs**: Upload a highly complex PDF. If Ollama fails to return valid JSON, the frontend might crash if it tries to do `JSON.parse(profile)`.

---

## 16. Deployment Readiness
- **Ready for deployment?**: No.
- **What remains?**: Needs a database. Needs a hosted LLM solution (or a dedicated GPU server for Ollama) because localhost Ollama won't work in a standard Vercel/Render deployment. 

---

## 17. Next Steps (Roadmap)
1. **Fix the LLM JSON Extraction**: Sanitize the output in `ollamaService.js`.
2. **Setup Database**: Implement `db.js` using Mongoose.
3. **Database Models**: Create `User` and `Conversation` models.
4. **State Management**: Refactor frontend to use Context API or Redux if prop-drilling gets messy.
5. **Job APIs**: Connect to an external API to populate the `OpportunityCard` component dynamically based on the parsed skills.

---

## 18. Developer Notes
- **Assumption**: You must have Ollama installed locally with the `llama3.2` model.
- **Technical Debt**: Currently, the backend directly exposes the LLM strings to the frontend. This needs error boundaries on the frontend to prevent crashes.

---

## 19. VS Code Handoff
- **Where to continue**: You should start by securing the database connection.
- **File to open first**: `backend/config/db.js`
- **Issue to fix first**: Implement MongoDB connection and create a Mongoose schema in `backend/models/User.js`.
- **Files that shouldn't be modified carelessly**: `backend/services/chatService.js` and `backend/services/ollamaService.js` (Prompt engineering is delicate; changes can break the output structure).
- **Order of development**: Database setup -> Auth -> Storing Chats -> External Job APIs.

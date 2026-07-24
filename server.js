const express = require("express");
const cors = require("cors");
require("dotenv").config();

const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chatRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

// ─────────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────────
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ─────────────────────────────────────────────────────────────
// Body Parsers
// ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/jobs", jobRoutes);

// ─────────────────────────────────────────────────────────────
// Root Route
// ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "🚀 AgentAI Backend is Running."
    });
});

// ─────────────────────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found.`
    });
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 AgentAI Backend running on http://localhost:${PORT}`);
    console.log(`📄 Upload API : http://localhost:${PORT}/api/upload`);
    console.log(`💬 Chat API   : http://localhost:${PORT}/api/chat`);
    console.log(`💼 Jobs API   : http://localhost:${PORT}/api/jobs`);
    console.log(`❤️ Health     : http://localhost:${PORT}/api/chat/health`);
});
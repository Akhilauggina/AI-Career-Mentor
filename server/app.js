const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use(cors());


app.use(express.json());

app.use("/api/resume", resumeRoutes);

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

module.exports = app;
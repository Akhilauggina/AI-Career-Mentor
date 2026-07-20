const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes");
const app = express();

app.use(cors());


app.use(express.json());

app.use("/api/resume", resumeRoutes);

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

module.exports = app;
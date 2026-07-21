---
name: Missing resume controller functions
description: resumeController.js was shipped with only uploadResume; getResumes and deleteResume were missing
---

resumeRoutes.js imports { uploadResume, getResumes, deleteResume } but the original resumeController.js only exported uploadResume.

Added getResumes (finds all resumes for req.user.id, sorted desc) and deleteResume (destroys Cloudinary asset + removes DB doc).

**Why:** The backend crashed on startup because router.get("/", authMiddleware, undefined) throws "argument handler must be a function".

**How to apply:** If a new route file is added, always verify its controller exports match what the route file destructures.

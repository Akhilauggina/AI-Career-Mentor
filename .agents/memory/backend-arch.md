---
name: Backend architecture
description: Port layout, proxy config, and DB connection behavior for this MERN project
---

Frontend (Vite): port 5000, host 0.0.0.0, allowedHosts: true
Backend (Express): port 3001 (process.env.PORT || 3001)
Proxy: vite.config.js proxies /api → http://localhost:3001
api.js baseURL: /api (relative — works via proxy in dev, and directly if frontend/backend share origin in prod)

**Why:** Replit webview requires port 5000 for the preview pane. Backend must be on a different port.

DB connection (server/config/db.js): non-fatal — logs warning and continues if MONGO_URI is missing. Server stays up so routes are reachable even without DB.

**How to apply:** Any future backend workflow must bind to port 3001. Never change Vite's port away from 5000.

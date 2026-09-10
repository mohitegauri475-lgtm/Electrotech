# 🚀 Render Cloud Deployment Guide (render.com)

This guide provides complete, step-by-step instructions for deploying this full-stack application (**Spring Boot 3 + PostgreSQL + React 18 / Vite**) on [Render](https://render.com).

---

## 🏛️ Architecture Overview

```mermaid
flowchart LR
    subgraph Render_Cloud [Render.com Cloud Environment]
        Client([Browser Client]) -->|HTTPS| Frontend[Static Site: electrotech-frontend<br/>React 18 + Vite SPA]
        Frontend -->|Axios REST API /api/*| Backend[Web Service: electrotech-backend<br/>Dockerized Spring Boot 3 JRE 17]
        Backend -->|HikariCP JDBC Connection| Database[(Managed PostgreSQL<br/>electrotech-db)]
    end
```

| Component | Render Service Type | Build / Runtime | Key Configuration |
| :--- | :--- | :--- | :--- |
| **Database** | PostgreSQL | Managed PostgreSQL 15+ (Free Tier) | Database: `giftedit_db`, User: `giftedit_user` |
| **Backend** | Web Service | Docker (Multi-stage Eclipse Temurin 17 JRE) | Dynamic Port, `SPRING_PROFILES_ACTIVE=postgres`, Auto `DATABASE_URL` adapter |
| **Frontend** | Static Site | Node.js (Vite production build) | Build: `npm install && npm run build`, Publish: `dist`, SPA Rewrite: `/*` -> `/index.html` |

---

## ⚡ Method 1: 1-Click Automatic Blueprint Deployment (Recommended)

Render Blueprints let you deploy the entire full-stack application (database, backend, frontend, networking, and environment variables) from the included `render.yaml` file with a single click.

### Step 1: Push Changes to GitHub
Make sure your latest code is pushed to your GitHub repository:
```bash
git add .
git commit -m "chore: configure full-stack project for Render cloud deployment"
git push origin main
```

### Step 2: Create Blueprint Instance on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top-right corner and select **Blueprint**.
3. Connect your GitHub repository (`mohitegauri475-lgtm/Electrotech`).
4. Select the `main` branch.
5. Render will automatically detect the `render.yaml` file in the root directory and show the three resources to be created:
   - `electrotech-db` (PostgreSQL Database)
   - `electrotech-backend` (Docker Web Service)
   - `electrotech-frontend` (Static Site)
6. Click **Apply**. Render will automatically provision the database, build the backend Docker container, build the frontend Vite app, and wire up all environment variables!

---

## 🛠️ Method 2: Manual Dashboard Creation

If you prefer to configure each service manually in the Render dashboard, follow these steps:

### Step 1: Create the Managed PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com) -> **New +** -> **PostgreSQL**.
2. Set the following fields:
   - **Name**: `electrotech-db`
   - **Database**: `giftedit_db`
   - **User**: `giftedit_user`
   - **Region**: Choose the closest region (e.g. `Oregon (US West)` or `Frankfurt (EU)`)
   - **Instance Type**: `Free`
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g. `postgresql://giftedit_user:password@dpg-...-a/giftedit_db`).

---

### Step 2: Deploy the Backend Web Service
1. Go to **New +** -> **Web Service**.
2. Connect your GitHub repository (`Electrotech`) and select the `main` branch.
3. Configure the service settings:
   - **Name**: `electrotech-backend`
   - **Region**: Choose the **same region** as your database
   - **Language / Runtime**: **Docker**
   - **Dockerfile Path**: `./Dockerfile` (or `./backend/Dockerfile` if Docker context is `./backend`)
   - **Docker Context**: `.`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `SPRING_PROFILES_ACTIVE` | `postgres` | Activates PostgreSQL datasource & Hibernate dialect |
   | `PORT` | `8080` | Render dynamically overrides this port |
   | `DATABASE_URL` | *Paste your Database Internal URL* | Smart adapter automatically parses into JDBC format |
   | `CORS_ALLOWED_ORIGINS` | `https://electrotech-frontend.onrender.com` | Enter your frontend URL once created |
5. Under **Health Check Path**, enter: `/api/hampers`.
6. Click **Create Web Service**.
7. Wait for the Docker build to complete. Note the backend service URL (e.g. `https://electrotech-backend.onrender.com`).

---

### Step 3: Deploy the Frontend Static Site
1. Go to **New +** -> **Static Site**.
2. Connect your GitHub repository (`Electrotech`) and select the `main` branch.
3. Configure the static site settings:
   - **Name**: `electrotech-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://electrotech-backend.onrender.com` (your backend service URL) |
5. Configure **Redirects / Rewrites** (essential for React Router SPA):
   - Click **Add Rule** under **Redirects/Rewrites**:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **Create Static Site**.
7. Once deployed, open your frontend URL: `https://electrotech-frontend.onrender.com`!

---

## 🔑 Complete Environment Variables Reference

### Backend (`electrotech-backend`)
| Variable | Required | Default / Sample | Description |
| :--- | :---: | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Yes | `postgres` | Sets active profile to PostgreSQL on cloud |
| `PORT` | Auto | `8080` | Assigned dynamically by Render |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:5432/giftedit_db` | Render PostgreSQL internal connection string |
| `CORS_ALLOWED_ORIGINS` | Optional | `https://*.onrender.com,https://yourdomain.com` | Comma-separated list of allowed web origins |
| `JWT_SECRET` | Optional | *Pre-configured fallback* | Custom 256-bit secret key for JWT signing |

### Frontend (`electrotech-frontend`)
| Variable | Required | Default / Sample | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | Yes | `https://electrotech-backend.onrender.com` | Cloud backend URL. Normalized automatically |

---

## 🎁 Default Pre-Seeded Catalog & Accounts

The cloud database automatically seeds on first startup with no manual SQL needed:

- **Customer Demo Account:**
  - Username: `demo_user`
  - Password: `password123`
  - Name: Lady Eleanor Vance
- **Concierge Admin Account:**
  - Username: `admin`
  - Password: `password123`
  - Name: Atelier Concierge Lead
- **Catalog Items:** 4 luxury keepsake boxes, 8 artisanal delicacies & keepsakes, 4 bestselling curated hampers, and verified buyer reviews.

---

## 💡 Troubleshooting & Tips

1. **Cold Starts on Free Tier:**
   - On Render free web services, idle containers spin down after 15 minutes of inactivity. The first request after sleep may take ~30–50 seconds to boot the Spring Boot JVM.
2. **CORS Errors:**
   - Ensure the backend's `CORS_ALLOWED_ORIGINS` matches the exact URL of your frontend (e.g. `https://electrotech-frontend.onrender.com`).
   - The backend includes native wildcard support for `https://*.onrender.com`.
3. **Database URL Parsing:**
   - The backend's `DatabaseConfig.java` natively supports both `postgres://` and `postgresql://` URI schemes, URL-encoded special characters in passwords, and custom ports.
<div align="center">

# 🌍 MetroScope Flow

### Know Before You Move

**Compare global cities side-by-side across cost of living, safety, healthcare, and quality of life — then save your findings to revisit anytime.**

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Live Demo](http://localhost:3000) · [API Docs](#api-reference) · [Report a Bug](https://github.com/RishiBuilds/metroscope-flow/issues) · [Request a Feature](https://github.com/RishiBuilds/metroscope-flow/issues)

![MetroScope Flow Banner](./docs/hero.png)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [Comparison Metrics](#comparison-metrics)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Development Scripts](#development-scripts)
- [Production Build](#production-build)
- [Security](#security)
- [Relocation Tools](#relocation-tools)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

MetroScope Flow is a full-stack web application for researching relocation and lifestyle decisions. Pick **2–4 cities**, explore interactive charts and comparison tables, and bookmark results with a free account.

> **Dataset:** 500 cities across six continents, modeled on 2026 cost-of-living and quality-of-life patterns. All index scores use **New York City as the 100 baseline**.

| Service      | URL                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------- |
| **Frontend** | [http://localhost:3000](http://localhost:3000)                                           |
| **API**      | [http://127.0.0.1:5000](http://127.0.0.1:5000)                                           |
| **Repo**     | [github.com/RishiBuilds/metroscope-flow](https://github.com/RishiBuilds/metroscope-flow) |

---

## Features

| Category                   | Highlights                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| 🏙️ **City Comparison**     | Compare 2–4 cities across 9 key metrics with winner highlighting                                          |
| 📊 **Rich Visualizations** | Bar charts, radar charts, and detailed data tables (toggle between views)                                 |
| 🔍 **Smart Search**        | Debounced autocomplete across city and country names                                                      |
| 🧭 **Discover Quiz**       | 5-step guided questionnaire (budget, climate, pace, priority, work style) that recommends matching cities |
| 💱 **Currency Conversion** | View all monetary values in USD, EUR, GBP, INR, JPY, CAD, or AUD via a global toggle                      |
| 👤 **User Accounts**       | Sign up, log in, and manage a personal profile                                                            |
| 🔖 **Saved Comparisons**   | Name and bookmark comparisons with personal notes; reload anytime                                         |
| 🔗 **Shareable Links**     | Generate public share tokens — recipients view results without logging in                                 |
| 🌐 **Shareable URLs**      | Comparison state persists in the URL (`/compare?ids=…`)                                                   |
| 🌙 **Dark Interface**      | Single, permanent dark mode                                                                               |
| 📱 **Responsive Design**   | Optimized layouts for mobile and desktop                                                                  |
| ♿ **Accessible UI**       | Skip links, ARIA labels, and keyboard-friendly controls                                                   |

---

## Tech Stack

| Layer        | Technologies                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 8, Recharts 3, Axios, Lucide Icons, Motion (Framer Motion) |
| **Backend**  | Node.js 22+, Express 5, Mongoose 9, JWT (httpOnly cookies), Helmet, express-rate-limit                    |
| **Database** | MongoDB                                                                                                   |
| **Tooling**  | Concurrent dev runner (`dev.mjs`), CSV seed pipeline                                                      |

> For deeper design decisions, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) **v22+**
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`, **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

### 1. Clone and Install

```bash
git clone https://github.com/RishiBuilds/metroscope-flow.git
cd metroscope-flow

cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Open `backend/.env` and — at minimum — set `JWT_SECRET` to a long random string:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/metroscope-flow
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key   # optional — enables AI culture guide
DB_SERVER_SELECTION_TIMEOUT_MS=5000
NODE_ENV=development
```

`frontend/.env` defaults work out of the box for local development:

```env
VITE_API_URL=/api
VITE_DEV_PROXY_TARGET=http://127.0.0.1:5000
VITE_PORT=3000
```

> The Vite dev server proxies `/api` to the backend automatically — no extra CORS config needed.

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This loads **500 cities** from `backend/src/data/cities_seed.csv` into MongoDB.

### 4. Start the App

**Option A — both services at once (recommended):**

```bash
# from the project root
npm run dev
```

**Option B — run separately:**

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start comparing. ✈️

---

## Project Structure

```
metroscope-flow/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, env vars, cookie settings
│   │   ├── controllers/     # Route handlers (thin — delegate to services)
│   │   ├── data/            # Seed data & static fallbacks (CSV, JSON)
│   │   ├── middleware/       # Auth, error handling, rate limiting
│   │   ├── models/          # Mongoose schemas (City, User, Comparison, …)
│   │   ├── repositories/    # Data-access layer
│   │   ├── routes/          # REST API route definitions
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Shared helpers (AppError, pagination)
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry point
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/             # Axios client + typed API modules
│   │   ├── assets/          # Hero images (responsive WebP + PNG)
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/          #   shadcn-style primitives
│   │   ├── context/         # AuthContext, CurrencyContext
│   │   ├── lib/             # Utility functions & motion helpers
│   │   └── pages/           # Route-level page components
│   ├── .env.example
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/
│   └── hero.png
├── dev.mjs                  # Concurrent dev runner
├── ARCHITECTURE.md
└── README.md
```

<details>
<summary><strong>Full file listing</strong></summary>

```
backend/src/
├── config/
│   ├── cookie.js
│   ├── db.js
│   └── env.js
├── controllers/
│   ├── auth.controller.js
│   ├── checklist.controller.js
│   ├── city.controller.js
│   ├── comparison.controller.js
│   ├── culture.controller.js
│   ├── discover.controller.js
│   └── visa.controller.js
├── data/
│   ├── checklistTemplates.js
│   ├── cities_seed.csv
│   ├── cultureFallbacks.js
│   ├── exchangeRates.js
│   └── seed.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── rateLimit.middleware.js
├── models/
│   ├── Checklist.js
│   ├── City.js
│   ├── SavedComparison.js
│   ├── User.js
│   ├── VisaResult.js
│   └── VisaTimeline.js
├── repositories/
│   └── city.repository.js
├── routes/
│   ├── auth.routes.js
│   ├── checklist.routes.js
│   ├── city.routes.js
│   ├── comparison.routes.js
│   ├── culture.routes.js
│   ├── discover.routes.js
│   ├── exchangeRates.routes.js
│   ├── health.routes.js
│   └── visa.routes.js
└── services/
    ├── auth.service.js
    ├── checklist.service.js
    ├── city.service.js
    ├── comparison.service.js
    ├── culture.service.js
    ├── discover.service.js
    ├── visa.service.js
    └── visaScoring.js

frontend/src/
├── api/
│   ├── auth.js
│   ├── cities.js
│   ├── client.js
│   ├── comparisons.js
│   ├── currency.js
│   ├── discover.js
│   └── tools.js
├── components/
│   ├── ui/
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── input.jsx
│   │   └── skeleton.jsx
│   ├── CityPicker.jsx
│   ├── ComparisonCharts.jsx
│   ├── CurrencyToggle.jsx
│   ├── ErrorBoundary.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── Reveal.jsx
│   ├── SaveModal.jsx
│   ├── ScrollProgress.jsx
│   ├── Skeleton.jsx
│   ├── icons.jsx
│   └── ui.jsx
└── pages/
    ├── ChecklistPage.jsx
    ├── ComparePage.jsx
    ├── CultureGuidePage.jsx
    ├── DiscoverPage.jsx
    ├── HomePage.jsx
    ├── LoginPage.jsx
    ├── NotFoundPage.jsx
    ├── ProfilePage.jsx
    ├── SavedPage.jsx
    ├── SharePage.jsx
    ├── SignupPage.jsx
    ├── VisaPredictorPage.jsx
    └── VisaTimelinePage.jsx
```

</details>

---

## Application Routes

| Path              | Page                       | Auth Required |
| ----------------- | -------------------------- | :-----------: |
| `/`               | Home                       |       —       |
| `/compare`        | City comparison            |       —       |
| `/discover`       | Discover quiz              |       —       |
| `/login`          | Log in                     |       —       |
| `/signup`         | Create account             |       —       |
| `/share/:token`   | Shared comparison (public) |       —       |
| `/saved`          | Saved comparisons          |      ✅       |
| `/profile`        | User profile               |      ✅       |
| `/visa-predictor` | Visa eligibility predictor |      ✅       |
| `/visa-timeline`  | Visa relocation timeline   |      ✅       |
| `/culture-guide`  | Cultural relocation guide  |      ✅       |
| `/checklist`      | Relocation checklist       |      ✅       |
| `*`               | 404 Not Found              |       —       |

---

## Comparison Metrics

Every city record in the dataset exposes 10 fields used across all comparisons and visualizations:

| Metric          | Field                   | Notes                       |
| --------------- | ----------------------- | --------------------------- |
| Monthly rent    | `avg_monthly_rent_usd`  | USD / month                 |
| Internet cost   | `internet_cost_usd`     | USD / month                 |
| Average salary  | `avg_salary_usd`        | USD / year                  |
| Food cost index | `food_cost_index`       | NYC = 100; lower is cheaper |
| Transport index | `transport_cost_index`  | NYC = 100; lower is cheaper |
| Quality of life | `quality_of_life_score` | 0–100; higher is better     |
| Healthcare      | `healthcare_score`      | 0–100; higher is better     |
| Safety          | `safety_score`          | 0–100; higher is better     |
| Pollution       | `pollution_score`       | 0–100; **lower** is better  |
| Cost of living  | `cost_of_living_index`  | NYC = 100; lower is cheaper |

All monetary values can be viewed in 7 currencies — **USD, EUR, GBP, INR, JPY, CAD, AUD** — via the global currency toggle.

---

## API Reference

**Base URL:** `http://127.0.0.1:5000`

All successful responses follow `{ data: … }`. Errors return `{ error: { message, code } }`.

### 🏙️ Cities

| Method | Endpoint                   | Auth | Description                                        |
| ------ | -------------------------- | :--: | -------------------------------------------------- |
| `GET`  | `/api/cities`              |  —   | List all cities (`id`, `city`, `country`)          |
| `GET`  | `/api/cities/search?q=`    |  —   | Search by name or country                          |
| `GET`  | `/api/cities/compare?ids=` |  —   | Full details for 2–10 cities (comma-separated IDs) |
| `GET`  | `/api/cities/:id`          |  —   | Full details for a single city                     |

### 🔐 Auth

| Method | Endpoint           | Auth | Description                         |
| ------ | ------------------ | :--: | ----------------------------------- |
| `POST` | `/api/auth/signup` |  —   | Create a user account               |
| `POST` | `/api/auth/login`  |  —   | Log in and receive a session cookie |
| `POST` | `/api/auth/logout` |  —   | Clear the session cookie            |
| `GET`  | `/api/auth/me`     |  ✅  | Get the authenticated user          |

### 🔖 Comparisons

| Method   | Endpoint                        | Auth | Description                                |
| -------- | ------------------------------- | :--: | ------------------------------------------ |
| `POST`   | `/api/comparisons`              |  ✅  | Save a comparison                          |
| `GET`    | `/api/comparisons`              |  ✅  | List saved comparisons                     |
| `GET`    | `/api/comparisons/:id`          |  ✅  | Get a saved comparison with full city data |
| `DELETE` | `/api/comparisons/:id`          |  ✅  | Delete a saved comparison                  |
| `PATCH`  | `/api/comparisons/:id/notes`    |  ✅  | Update notes on a saved comparison         |
| `POST`   | `/api/comparisons/:id/share`    |  ✅  | Generate a public share token              |
| `GET`    | `/api/comparisons/share/:token` |  —   | View a shared comparison                   |

### 🧭 Discover

| Method | Endpoint        | Auth | Description                                |
| ------ | --------------- | :--: | ------------------------------------------ |
| `POST` | `/api/discover` |  —   | Get city recommendations from quiz answers |

### 🛠️ Relocation Tools

| Method  | Endpoint                     | Auth | Description                      |
| ------- | ---------------------------- | :--: | -------------------------------- |
| `POST`  | `/api/visa/predict`          |  ✅  | Run visa eligibility prediction  |
| `POST`  | `/api/visa/results`          |  ✅  | Save visa prediction results     |
| `GET`   | `/api/visa/results`          |  ✅  | Retrieve saved visa results      |
| `GET`   | `/api/visa/timeline`         |  ✅  | Get visa relocation timeline     |
| `PATCH` | `/api/visa/timeline/:userId` |  ✅  | Update timeline phase status     |
| `POST`  | `/api/culture/chat`          |  ✅  | Get cultural relocation guidance |
| `POST`  | `/api/checklist`             |  ✅  | Create relocation checklist      |
| `GET`   | `/api/checklist`             |  ✅  | Get user's checklist             |
| `PATCH` | `/api/checklist/:id`         |  ✅  | Update checklist item status     |

### 💱 Exchange Rates

| Method | Endpoint              | Auth | Description                                 |
| ------ | --------------------- | :--: | ------------------------------------------- |
| `GET`  | `/api/exchange-rates` |  —   | Get supported currencies and exchange rates |

### ❤️ Health

| Method | Endpoint      | Auth | Description  |
| ------ | ------------- | :--: | ------------ |
| `GET`  | `/api/health` |  —   | Health check |

### Example Requests

```bash
# Search cities
curl "http://127.0.0.1:5000/api/cities/search?q=tokyo"

# Compare two cities (replace with real ObjectIds from /api/cities)
curl "http://127.0.0.1:5000/api/cities/compare?ids=ID1,ID2"

# Discover cities via quiz
curl -X POST "http://127.0.0.1:5000/api/discover" \
  -H "Content-Type: application/json" \
  -d '{
    "budget": "medium",
    "climate": "warm",
    "pace": "balanced",
    "priority": "quality",
    "work": "remote"
  }'

# Get exchange rates
curl "http://127.0.0.1:5000/api/exchange-rates"
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                         | Required | Default                                     | Description                             |
| -------------------------------- | :------: | ------------------------------------------- | --------------------------------------- |
| `PORT`                           |    —     | `5000`                                      | API server port                         |
| `MONGO_URI`                      |    ✅    | `mongodb://localhost:27017/metroscope-flow` | MongoDB connection string               |
| `JWT_SECRET`                     |    ✅    | —                                           | Secret for signing JWTs                 |
| `JWT_EXPIRES_IN`                 |    —     | `7d`                                        | JWT expiration duration                 |
| `CLIENT_URL`                     |    ✅    | `http://localhost:3000`                     | Frontend origin for CORS                |
| `GEMINI_API_KEY`                 |    —     | —                                           | Enables Gemini AI for the culture guide |
| `DB_SERVER_SELECTION_TIMEOUT_MS` |    —     | `5000`                                      | MongoDB server selection timeout (ms)   |
| `NODE_ENV`                       |    —     | `development`                               | Environment mode                        |

### Frontend (`frontend/.env`)

| Variable                | Required | Default                 | Description                       |
| ----------------------- | :------: | ----------------------- | --------------------------------- |
| `VITE_API_URL`          |    —     | `/api`                  | API base path                     |
| `VITE_DEV_PROXY_TARGET` |    —     | `http://127.0.0.1:5000` | Dev proxy target for API requests |
| `VITE_PORT`             |    —     | `3000`                  | Vite dev server port              |

---

## Development Scripts

| Command           | Directory   | Description                           |
| ----------------- | ----------- | ------------------------------------- |
| `npm run dev`     | root        | Start backend + frontend concurrently |
| `npm run dev`     | `backend/`  | Start API server with `--watch`       |
| `npm run start`   | `backend/`  | Start API server (production mode)    |
| `npm run seed`    | `backend/`  | Load or update city data from CSV     |
| `npm run dev`     | `frontend/` | Start Vite dev server                 |
| `npm run build`   | `frontend/` | Production build                      |
| `npm run preview` | `frontend/` | Preview the production build          |
| `npm run build`   | root        | Build frontend for deployment         |

---

## Production Build

```bash
cd frontend
npm run build
```

- Set `VITE_API_URL` in `frontend/.env` to your deployed API origin if the frontend and backend are on different domains.
- Ensure `CLIENT_URL` in `backend/.env` matches your deployed frontend URL for CORS.

---

## Security

MetroScope Flow applies defense-in-depth across the stack:

| Layer                | Measure                                                         |
| -------------------- | --------------------------------------------------------------- |
| **Passwords**        | Hashed with **bcryptjs**                                        |
| **Sessions**         | JWT stored in **httpOnly cookies** (inaccessible to JavaScript) |
| **Headers**          | **Helmet** sets secure HTTP headers                             |
| **Rate limiting**    | 2,000 req / 15 min globally; 20 req / 15 min on auth routes     |
| **Input validation** | Enforced on all API endpoints                                   |

---

## Relocation Tools

Authenticated users unlock four AI-powered relocation modules:

| Tool               | Path              | Description                                                                                                   |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------- |
| **Visa Predictor** | `/visa-predictor` | Weighted eligibility estimate, improvement tips, and destination ranking — results saved to your profile      |
| **Visa Timeline**  | `/visa-timeline`  | Persistent six-phase roadmap based on your latest saved prediction                                            |
| **Culture Guide**  | `/culture-guide`  | Relocation-specific cultural guidance via Gemini AI (with static country/topic fallbacks when not configured) |
| **Checklist**      | `/checklist`      | Country and move-type checklist with server-persisted completion state                                        |

> **Tip:** Set `GEMINI_API_KEY` in `backend/.env` to enable AI-powered culture guide responses. The culture guide always works even without it, falling back to curated static content.

---

## Troubleshooting

| Symptom                                             | Fix                                                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `Missing required environment variable: JWT_SECRET` | Copy `backend/.env.example` → `backend/.env` and set `JWT_SECRET`                    |
| `MongoServerError: connect ECONNREFUSED`            | Start MongoDB locally, or update `MONGO_URI` to your Atlas connection string         |
| Frontend loads but API calls fail                   | Confirm the backend is running on port `5000` and `CLIENT_URL=http://localhost:3000` |
| Empty city search results                           | Run `npm run seed` inside `backend/`                                                 |
| Port 3000 already in use                            | Stop the conflicting process or change the port in `frontend/vite.config.js`         |

---

## License

Distributed under the [MIT License](LICENSE). See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ by [RishiBuilds](https://github.com/RishiBuilds)

</div>

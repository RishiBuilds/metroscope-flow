# MetroScope Flow — Know Before You Move

![MetroScope Flow Banner](./docs/hero.png)

**Know before you move.** Compare global cities side-by-side across cost of living, safety, healthcare, and quality of life — then save your findings to revisit later.

---

## Overview

MetroScope Flow is a full-stack web app for researching relocation and lifestyle decisions. Pick 2–4 cities, explore interactive charts and comparison tables, and bookmark results with a free account.

The dataset covers **500 cities** across six continents, modeled on 2026 cost-of-living and quality-of-life patterns. All index scores use **New York City as the 100 baseline**.

| | |
|---|---|
| **Frontend** | [http://localhost:3000](http://localhost:3000) |
| **API** | [http://127.0.0.1:5000](http://127.0.0.1:5000) |
| **Repository** | [github.com/RishiBuilds/metroscope-flow](https://github.com/RishiBuilds/metroscope-flow) |

---

## Features

- **Side-by-side comparison** — Compare 2–4 cities across 9 key metrics with winner highlighting
- **Rich visualizations** — Bar charts, radar charts, and detailed data tables (toggle views)
- **Smart city search** — Debounced autocomplete across city and country names
- **User accounts** — Sign up, log in, and manage a personal profile
- **Saved comparisons** — Name and bookmark comparisons; reload them anytime
- **Shareable URLs** — Comparison state persists in the URL (`/compare?ids=…`)
- **Dark interface** — A single, permanent dark mode
- **Responsive design** — Optimized layouts for mobile and desktop
- **Accessible UI** — Skip links, ARIA labels, and keyboard-friendly controls

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 8, Recharts 3, Axios, Lucide Icons |
| **Backend** | Node.js 22+, Express 5, Mongoose 9, JWT (httpOnly cookies), Helmet, express-rate-limit |
| **Database** | MongoDB |
| **Tooling** | Concurrent dev runner (`dev.mjs`), CSV seed pipeline |

For deeper design notes, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) **v22+**
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

### 1. Clone and install

```bash
git clone https://github.com/RishiBuilds/metroscope-flow.git
cd metroscope-flow

cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` — at minimum, set `JWT_SECRET` to a long random string:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/metroscope-flow
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

`frontend/.env` can stay empty in development. The Vite dev server proxies `/api` to the backend automatically.

### 3. Seed the database

```bash
cd backend
npm run seed
```

This loads 500 cities from `backend/src/data/cities_seed.csv` into MongoDB.

### 4. Run the app

**Option A — both services at once (recommended):**

```bash
# from the project root
npm run dev
```

**Option B — run separately:**

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
metroscope-flow/
├── backend/
│   ├── src/
│   │   ├── config/                   # DB connection, env vars, cookie settings
│   │   │   ├── cookie.js
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/              # Route handlers (thin — delegate to services)
│   │   │   ├── auth.controller.js
│   │   │   ├── checklist.controller.js
│   │   │   ├── city.controller.js
│   │   │   ├── comparison.controller.js
│   │   │   ├── culture.controller.js
│   │   │   └── visa.controller.js
│   │   ├── data/                     # Seed data and static fallbacks
│   │   │   ├── checklistTemplates.js
│   │   │   ├── cities_seed.csv
│   │   │   ├── cultureFallbacks.js
│   │   │   └── seed.js
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── Checklist.js
│   │   │   ├── City.js
│   │   │   ├── SavedComparison.js
│   │   │   ├── User.js
│   │   │   ├── VisaResult.js
│   │   │   └── VisaTimeline.js
│   │   ├── repositories/             # Data-access layer
│   │   │   └── city.repository.js
│   │   ├── routes/                   # REST API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── checklist.routes.js
│   │   │   ├── city.routes.js
│   │   │   ├── comparison.routes.js
│   │   │   ├── culture.routes.js
│   │   │   ├── health.routes.js
│   │   │   └── visa.routes.js
│   │   ├── services/                 # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── checklist.service.js
│   │   │   ├── city.service.js
│   │   │   ├── comparison.service.js
│   │   │   ├── culture.service.js
│   │   │   ├── visa.service.js
│   │   │   └── visaScoring.js
│   │   ├── utils/                    # Shared helpers
│   │   │   ├── AppError.js
│   │   │   └── pagination.js
│   │   ├── app.js                    # Express app setup
│   │   └── index.js                  # Server entry point
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/                      # Axios client and API modules
│   │   │   ├── auth.js
│   │   │   ├── cities.js
│   │   │   ├── client.js
│   │   │   ├── comparisons.js
│   │   │   └── tools.js
│   │   ├── assets/                   # Hero images (responsive WebP + PNG)
│   │   ├── components/               # Reusable UI components
│   │   │   ├── ui/                   #   shadcn-style primitives
│   │   │   │   ├── badge.jsx
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   └── skeleton.jsx
│   │   │   ├── CityPicker.jsx
│   │   │   ├── ComparisonCharts.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Reveal.jsx
│   │   │   ├── SaveModal.jsx
│   │   │   ├── ScrollProgress.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── icons.jsx
│   │   │   └── ui.jsx
│   │   ├── context/                  # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── lib/                      # Utility functions and motion helpers
│   │   │   ├── motion.js
│   │   │   └── utils.js
│   │   ├── pages/                    # Route-level page components
│   │   │   ├── ChecklistPage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   ├── CultureGuidePage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SavedPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── VisaPredictorPage.jsx
│   │   │   └── VisaTimelinePage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── components.json               # shadcn/ui configuration
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/
│   └── hero.png                      # README banner image
├── dev.mjs                           # Runs backend + frontend concurrently
├── ARCHITECTURE.md
├── ARCHITECTURE_NOTES.md
└── README.md
```

---

## Application Routes

| Path | Page | Auth required |
|---|---|---|
| `/` | Home | No |
| `/compare` | City comparison | No |
| `/login` | Log in | No |
| `/signup` | Create account | No |
| `/saved` | Saved comparisons | Yes |
| `/profile` | User profile | Yes |
| `/visa-predictor` | Visa eligibility predictor | Yes |
| `/visa-timeline` | Visa relocation timeline | Yes |
| `/culture-guide` | Cultural relocation guide | Yes |
| `/checklist` | Relocation checklist | Yes |
| `*` | 404 Not Found | No |

---

## Comparison Metrics

Each city record includes the following fields:

| Metric | Field | Notes |
|---|---|---|
| Monthly rent | `avg_monthly_rent_usd` | USD per month |
| Internet cost | `internet_cost_usd` | USD per month |
| Average salary | `avg_salary_usd` | USD per year |
| Food cost index | `food_cost_index` | NYC = 100; lower is cheaper |
| Transport index | `transport_cost_index` | NYC = 100; lower is cheaper |
| Quality of life | `quality_of_life_score` | 0–100; higher is better |
| Healthcare | `healthcare_score` | 0–100; higher is better |
| Safety | `safety_score` | 0–100; higher is better |
| Pollution | `pollution_score` | 0–100; lower is better |
| Cost of living | `cost_of_living_index` | NYC = 100; lower is cheaper |

---

## API Reference

Base URL: `http://127.0.0.1:5000`

All successful responses use `{ data: … }`. Errors return `{ error: { message, code } }`.

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Health check |
| `GET` | `/api/cities` | No | List all cities (`id`, `city`, `country`) |
| `GET` | `/api/cities/search?q=` | No | Search cities by name or country |
| `GET` | `/api/cities/compare?ids=` | No | Full details for 2–10 cities (comma-separated IDs) |
| `GET` | `/api/cities/:id` | No | Full details for a single city |
| `POST` | `/api/auth/signup` | No | Create a user account |
| `POST` | `/api/auth/login` | No | Log in and receive a session cookie |
| `POST` | `/api/auth/logout` | No | Clear the session cookie |
| `GET` | `/api/auth/me` | Yes | Get the authenticated user |
| `POST` | `/api/comparisons` | Yes | Save a comparison |
| `GET` | `/api/comparisons` | Yes | List saved comparisons |
| `GET` | `/api/comparisons/:id` | Yes | Get a saved comparison with full city data |
| `DELETE` | `/api/comparisons/:id` | Yes | Delete a saved comparison |

### Example requests

```bash
# Search cities
curl "http://127.0.0.1:5000/api/cities/search?q=tokyo"

# Compare two cities (replace with real ObjectIds from /api/cities)
curl "http://127.0.0.1:5000/api/cities/compare?ids=ID1,ID2"
```

---

## Development

### Available scripts

| Command | Location | Description |
|---|---|---|
| `npm run dev` | root | Start backend + frontend together |
| `npm run dev` | `backend/` | Start API with `--watch` |
| `npm run start` | `backend/` | Start API (production) |
| `npm run seed` | `backend/` | Load or update city data from CSV |
| `npm run dev` | `frontend/` | Start Vite dev server |
| `npm run build` | `frontend/` | Production build |
| `npm run preview` | `frontend/` | Preview production build |
| `npm run build` | root | Build frontend for deployment |

### Dev proxy

During development, Vite proxies `/api` requests to `http://127.0.0.1:5000`. This keeps frontend and API on the same origin so httpOnly session cookies work without extra CORS configuration.

---

## Production Build

```bash
cd frontend
npm run build
```

Set `VITE_API_URL` in `frontend/.env` to your deployed API origin if the frontend and backend are served from different domains.

Ensure `CLIENT_URL` in `backend/.env` matches your deployed frontend URL for CORS.

---

## Security

- Passwords hashed with **bcryptjs**
- Sessions stored as **JWT in httpOnly cookies** (not accessible to JavaScript)
- **Helmet** for HTTP security headers
- **Rate limiting** on all API routes (2,000 req / 15 min) and auth routes (20 req / 15 min)
- Input validation on all API endpoints

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `Missing required environment variable: JWT_SECRET` | Copy `backend/.env.example` to `backend/.env` and set `JWT_SECRET` |
| `MongoServerError: connect ECONNREFUSED` | Start MongoDB locally or update `MONGO_URI` to your Atlas connection string |
| Frontend loads but API calls fail | Confirm the backend is running on port 5000 and `CLIENT_URL` matches `http://localhost:3000` |
| Empty city search results | Run `npm run seed` in the `backend/` directory |
| Port 3000 already in use | Stop the conflicting process or change the port in `frontend/vite.config.js` |

---

## License

MIT

---

## Relocation tools

Authenticated users can use four relocation modules:

- `/visa-predictor` — weighted eligibility estimate, improvement tips, destination ranking, and saved results.
- `/visa-timeline` — a persistent six-phase roadmap based on the latest saved prediction.
- `/culture-guide` — relocation-specific cultural guidance using Gemini when configured, with country/topic fallbacks when it is not.
- `/checklist` — a country and move-type checklist with server-persisted completion state.

Set `GEMINI_API_KEY` in `backend/.env` to enable Gemini responses. It is optional: the culture guide always has static fallbacks.

New protected API endpoints include `POST /api/visa/predict`, `POST|GET /api/visa/results`, `GET /api/visa/timeline`, `PATCH /api/visa/timeline/:userId`, `POST /api/culture/chat`, and `POST|GET /api/checklist` with `PATCH /api/checklist/:id`.

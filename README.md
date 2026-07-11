# Getting Fast at React

A step-by-step **React + TypeScript** frontend for [fastAPI-101](https://github.com/iammikek/fastAPI-101) — same items/categories catalog, same Laravel crossover style, client-side SPA instead of server-rendered HTML.

**SPA:** React owns the browser UI and calls the **fastAPI-101 JSON API** on port **8000**. This is the client-side counterpart to django-101's `/shop/` templates.

---

## What's Included

1. **Vite + React 19 + TypeScript** — fast dev server with HMR
2. **React Router** — pages for items, categories, stats, auth
3. **API client layer** — typed `fetch` wrapper (`src/api/`)
4. **JWT auth** — register, login, Bearer token on writes (matches fastAPI-101 Step 22)
5. **Item list** — filters (`min_price`, `max_price`, `category_id`, `name_contains`)
6. **Pagination UI** — consumes `{ items, total, skip, limit }` from the API
7. **Category management** — create/delete categories
8. **Stats page** — `GET /items/stats/summary`
9. **Vitest + React Testing Library** — unit/component tests
10. **CI** — parallel lint, test, and build jobs (GitHub Actions)
11. **Docker** — dev container on port **3000**

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Project Structure](#2-project-structure)
3. [fastAPI ↔ React map](#3-fastapi--react-map)
4. [Step 1: Vite + React scaffold](#4-step-1-vite--react-scaffold)
5. [Step 2: API client layer](#5-step-2-api-client-layer)
6. [Step 3: React Router pages](#6-step-3-react-router-pages)
7. [Step 4: Item list + filters](#7-step-4-item-list--filters)
8. [Step 5: Pagination UI](#8-step-5-pagination-ui)
9. [Step 6: Categories page](#9-step-6-categories-page)
10. [Step 7: JWT auth context](#10-step-7-jwt-auth-context)
11. [Step 8: Tests](#11-step-8-tests)
12. [Step 9: CI/CD pipeline](#12-step-9-cicd-pipeline)
13. [Step 10: Docker](#13-step-10-docker)
14. [Quick Reference](#14-quick-reference)

---

## 1. Quick Start

Run **fastAPI-101** and **react-101** side by side:

```bash
# Terminal 1 — API (port 8000)
cd fastAPI-101
source .venv/bin/activate
uvicorn main:app --reload

# Terminal 2 — React (port 3000)
cd react-101
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:3000** — register, log in, browse and create items.

**Note:** fastAPI-101 `CORS_ORIGINS` must include `http://localhost:3000` (default in `.env.example`).

### Tests

```bash
npm run test
npm run test:coverage
```

### Docker

```bash
docker compose up --build
```

Uses `VITE_API_URL=http://host.docker.internal:8000` to reach fastAPI-101 on your host machine.

---

## 2. Project Structure

```
react-101/
├── index.html
├── vite.config.ts
├── package.json
├── Dockerfile / Dockerfile.prod
├── docker-compose.yml
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # Routes
│   ├── api/                    # fetch client (Laravel HTTP layer)
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── items.ts
│   │   └── categories.ts
│   ├── types/
│   │   └── catalog.ts          # TypeScript interfaces (Pydantic equivalent)
│   ├── context/
│   │   └── AuthContext.tsx     # JWT state (Laravel auth session)
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── ItemTable.tsx
│   │   ├── ItemFiltersForm.tsx
│   │   └── Pagination.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ItemsPage.tsx
│   │   ├── ItemDetailPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   └── StatsPage.tsx
│   ├── styles/
│   │   └── app.css
│   └── test/
│       └── setup.ts
└── .github/workflows/ci.yml
```

---

## 3. fastAPI ↔ React map

| fastAPI-101                   | react-101                                      |
| ----------------------------- | ---------------------------------------------- |
| `app/schemas.py`              | `src/types/catalog.ts`                         |
| `app/routers/items.py`        | `src/api/items.ts` + `ItemsPage`               |
| `app/routers/categories.py`   | `src/api/categories.ts` + `CategoriesPage`     |
| `app/routers/auth.py`         | `src/api/auth.ts` + `AuthContext`              |
| `Depends(get_current_user)`   | `Authorization: Bearer` header in `apiRequest` |
| `ItemListResponse` pagination | `Pagination` component                         |
| `ItemListFilters`             | `ItemFiltersForm` component                    |
| Swagger `/docs`               | Browser UI at `/items`, `/categories`          |

| django-101                         | react-101                     |
| ---------------------------------- | ----------------------------- |
| `/shop/` server-rendered templates | React SPA pages               |
| Session auth in forms              | JWT in `localStorage`         |
| Port **8001** (monolith)           | Port **3000** (frontend only) |

---

## 4. Step 1: Vite + React scaffold

```bash
npm create vite@latest react-101 -- --template react-ts
cd react-101
npm install
npm install react-router-dom
```

Vite gives you TypeScript, HMR, and a production build — the React equivalent of uvicorn + FastAPI's auto-reload.

---

## 5. Step 2: API client layer

`src/api/client.ts` wraps `fetch`:

- Prefixes `VITE_API_URL` (default `http://localhost:8000`)
- Parses `{ detail, code }` errors from the API
- Attaches `Authorization: Bearer` when `auth: true`

Domain modules split by resource:

```
src/api/items.ts       → listItems, createItem, …
src/api/categories.ts  → listCategories, createCategory, …
src/api/auth.ts        → loginUser, registerUser, fetchCurrentUser
```

---

## 6. Step 3: React Router pages

`App.tsx` defines routes inside a shared `Layout` (nav + auth links):

| Path                  | Page           |
| --------------------- | -------------- |
| `/`                   | Home           |
| `/items`              | Item list      |
| `/items/new`          | Create item    |
| `/items/:id`          | View/edit item |
| `/categories`         | Category list  |
| `/stats`              | Stats summary  |
| `/login`, `/register` | Auth           |

---

## 7. Step 4: Item list + filters

`ItemsPage` loads categories for the filter dropdown, then calls:

```
GET /items?skip=0&limit=10&category_id=2&min_price=10&name_contains=widget
```

`ItemFiltersForm` holds filter state; `ItemTable` renders results.

---

## 8. Step 5: Pagination UI

The API returns:

```json
{ "items": [...], "total": 42, "skip": 0, "limit": 10 }
```

`Pagination` shows page numbers and calls `onPageChange(skip)` — Laravel `paginate()` links in React.

---

## 9. Step 6: Categories page

`CategoriesPage` lists categories with pagination and lets authenticated users create/delete categories (JWT required for writes).

---

## 10. Step 7: JWT auth context

`AuthContext`:

1. `POST /auth/register` → `POST /auth/login` → store `access_token` in `localStorage`
2. Sets token on `apiRequest` for write calls
3. `GET /auth/me` on page load to restore session

Log in to create items and categories. Read endpoints work without auth.

---

## 11. Step 8: Tests

Vitest + React Testing Library (Jest equivalent in the Vite ecosystem):

| File                                 | Tests                              |
| ------------------------------------ | ---------------------------------- |
| `src/api/client.test.ts`             | fetch wrapper, auth header, errors |
| `src/components/Pagination.test.tsx` | page navigation                    |
| `src/pages/HomePage.test.tsx`        | render + links                     |

```bash
npm run test
npm run test:coverage   # 10% line threshold (grow as you add steps)
```

---

## 12. Step 9: CI/CD pipeline

`.github/workflows/ci.yml` — three parallel jobs:

| Job       | Command                           |
| --------- | --------------------------------- |
| **Lint**  | `npm run lint` + `npm run format` |
| **Test**  | `npm run test:coverage`           |
| **Build** | `npm run build`                   |

Shared setup in `.github/actions/setup/` (Node 22 + npm cache).

---

## 13. Step 10: Docker

| File                 | Purpose                              |
| -------------------- | ------------------------------------ |
| `Dockerfile`         | Dev — `npm run dev` on port 3000     |
| `Dockerfile.prod`    | Production — `npm run build` + nginx |
| `docker-compose.yml` | Dev with hot reload                  |

**Port 3000** is for React. **Port 8000** stays with fastAPI-101. Don't confuse them with django-101 (**8001**).

---

## 14. Quick Reference

| Goal                 | Command                                    |
| -------------------- | ------------------------------------------ |
| Install deps         | `npm install`                              |
| Start dev server     | `npm run dev`                              |
| Run tests            | `npm run test`                             |
| Run tests + coverage | `npm run test:coverage`                    |
| Lint                 | `npm run lint`                             |
| Format check         | `npm run format`                           |
| Production build     | `npm run build`                            |
| Docker dev           | `docker compose up --build`                |
| API must be running  | `uvicorn main:app --reload` in fastAPI-101 |

---

## Learning path (with fastAPI-101 + django-101)

| Project         | Role                                     | Port |
| --------------- | ---------------------------------------- | ---- |
| **fastAPI-101** | JSON API backend                         | 8000 |
| **django-101**  | Full-stack monolith + `/shop/` templates | 8001 |
| **react-101**   | SPA frontend calling fastAPI-101         | 3000 |

You've now seen the same catalog domain three ways: FastAPI JSON API, Django server-rendered shop, and React client-side SPA.

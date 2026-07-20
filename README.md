# Getting Fast at React

A step-by-step **React 19 + TypeScript** SPA client for the *-101 items API — same JSON contract as [fastAPI-101](https://github.com/iammikek/fastAPI-101), with parity to [vue-101](https://github.com/iammikek/vue-101) and [flutter-101](https://github.com/iammikek/flutter-101) on the web.

**Audience:** Frontend developers learning how a Laravel-style API maps to a browser SPA (JWT auth, categories, paginated items, stats).

**Client-only:** This repo does not run a backend. Point it at a *-101 API (default: fastAPI-101 on port **8000**).

---

## What's Included

1. **React 19 + Vite** — fast dev server and production build
2. **React Router** — `/items`, `/categories`, `/stats`, `/login`, `/register`
3. **API client layer** — typed `fetch` wrapper (`src/api/`)
4. **JWT auth** — register, login, Bearer token on write endpoints
5. **Categories** — list, create, delete
6. **Items** — list with filters + pagination, detail, create, edit, delete
7. **Stats** — `GET /items/stats/summary`
8. **Vitest + React Testing Library** — unit and component tests
9. **Live mode** — calls a *-101 backend via `VITE_API_URL`

---

## Quick Start

### Live mode (fastAPI-101)

```bash
# Terminal 1 — backend
cd ../fastAPI-101
uvicorn main:app --reload --port 8000

# Terminal 2 — SPA
cd ../react-101
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:3000** — register at `/register`, then browse and create items.

**Note:** fastAPI-101 `CORS_ORIGINS` must include `http://localhost:3000` (default in `.env.example`).

### Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
react-101/
├── src/
│   ├── api/           # HTTP client (auth, items, categories)
│   ├── context/       # AuthProvider, useAuth, auth context
│   ├── components/    # Layout, ItemTable, Pagination, filters
│   ├── pages/         # Route pages (items, categories, stats, login)
│   └── types/         # TypeScript interfaces
├── .env.example
├── package.json
└── vite.config.ts
```

---

## Configuration

| Variable       | Default                 | Purpose  |
| -------------- | ----------------------- | -------- |
| `VITE_API_URL` | `http://localhost:8000` | API root |

---

## API Endpoints (client coverage)

| Path                   | Method           | Auth          | UI                      |
| ---------------------- | ---------------- | ------------- | ----------------------- |
| `/`                    | GET              | —             | (health via API client) |
| `/health`              | GET              | —             | (health via API client) |
| `/auth/register`       | POST             | —             | `/register`             |
| `/auth/login`          | POST             | —             | `/login`                |
| `/auth/me`             | GET              | JWT           | after sign-in           |
| `/categories`          | GET/POST         | JWT on POST   | `/categories`           |
| `/categories/{id}`     | DELETE           | JWT           | `/categories`           |
| `/items`               | GET/POST         | JWT on POST   | `/items` + `/items/new` |
| `/items/stats/summary` | GET              | —             | `/stats`                |
| `/items/{id}`          | GET/PATCH/DELETE | JWT on writes | `/items/:id`            |

Query params on `GET /items`: `skip`, `limit`, `category_id`, `name_contains`, `min_price`, `max_price`.

---

## Laravel → React Mapping

| Laravel                       | react-101                                      |
| ----------------------------- | ---------------------------------------------- |
| Sanctum personal access token | JWT `Authorization: Bearer`                    |
| Blade views                   | React components + React Router                |
| Form Request validation       | Client forms + API 422                         |
| Eloquent `category_id`        | `category_id` + nested `category`              |
| `paginate()`                  | `{ items, total, skip, limit }` + `Pagination` |
| `@auth` middleware            | `useAuth()` + conditional UI                   |

---

## *-101 Family

### API backends (pair with this client)

| Repo                                                           | Port  | Type     | Stack                    |
| -------------------------------------------------------------- | ----- | -------- | ------------------------ |
| [fastAPI-101](https://github.com/iammikek/fastAPI-101)         | 8000  | API-only | FastAPI, SQLAlchemy      |
| [django-101](https://github.com/iammikek/django-101)           | 8001  | Monolith | Django + DRF + shop      |
| [symfony-101](https://github.com/iammikek/symfony-101)         | 8002  | Monolith | Symfony + shop           |
| [laravel-101](https://github.com/iammikek/laravel-101)         | 8003  | Monolith | Laravel + shop           |
| [framework-x-101](https://github.com/iammikek/framework-x-101) | 8004  | Monolith | Framework X + shop       |
| [orchestr-101](https://github.com/iammikek/orchestr-101)       | 8005  | Monolith | Orchestr + shop          |
| [nest-101](https://github.com/iammikek/nest-101)               | 8006  | API-only | NestJS, TypeScript       |
| [express-101](https://github.com/iammikek/express-101)         | 8007  | API-only | Express, Vitest          |
| [go-101](https://github.com/iammikek/go-101)                   | 8000* | API-only | Gin, GORM                |
| [fortran-101](https://github.com/iammikek/fortran-101)         | 8008  | API-only | Fortran, fpm             |
| [java-101](https://github.com/iammikek/java-101)               | 8009  | API-only | Spring Boot, JPA, Flyway |
| [dotNet-101](https://github.com/iammikek/dotNet-101)               | 8010  | API-only | ASP.NET Core, xUnit  |
| [flask-101](https://github.com/iammikek/flask-101)         | 8011  | API-only | Flask, pytest             |
| [rails-101](https://github.com/iammikek/rails-101)               | 8012  | Monolith | Rails + shop             |
\* go-101 also uses port 8000 — run one backend at a time, or change port in config.

### Other clients

| Repo                                                   | Platform         | Stack                         |
| ------------------------------------------------------ | ---------------- | ----------------------------- |
| [flutter-101](https://github.com/iammikek/flutter-101) | Mobile / desktop | Flutter (iOS, macOS, Android) |
| **react-101**                                          | Web browser      | React 19, Vite, Vitest        |
| [vue-101](https://github.com/iammikek/vue-101)         | Web browser      | Vue 3, Vite, Pinia            |
| [alpine-101](https://github.com/iammikek/alpine-101)         | Web browser      | Alpine.js, Vite, Vitest       |

### Suggested pairing

- **Learning the API:** [fastAPI-101](https://github.com/iammikek/fastAPI-101) (8000) + react-101
- **Compare monolith vs SPA:** [django-101](https://github.com/iammikek/django-101) `/shop/` (8001) vs react-101 calling the JSON API
- **Compare Node APIs:** [nest-101](https://github.com/iammikek/nest-101) (8006) or [express-101](https://github.com/iammikek/express-101) (8007) + react-101

Catalogue: [automica.io/learning-101](https://automica.io/learning-101.html)

---

## Quick Reference

| Goal             | Command                                                      |
| ---------------- | ------------------------------------------------------------ |
| Copy env         | `cp .env.example .env`                                       |
| Install          | `npm install`                                                |
| Dev server       | `npm run dev` → http://localhost:3000                        |
| Production build | `npm run build`                                              |
| Preview build    | `npm run preview`                                            |
| Run tests        | `npm run test`                                               |
| Pair with API    | Set `VITE_API_URL=http://localhost:8000` and run fastAPI-101 |

# Bus Complaints Tracking System

A full-stack web application for submitting, tracking, and analyzing public transport complaints.

## Tech Stack

| Layer        | Technology                                                |
| ------------ | --------------------------------------------------------- |
| Backend      | NestJS + TypeScript                                       |
| Database     | PostgreSQL 16 + TypeORM                                   |
| Auth         | JWT (admin / user roles)                                  |
| File Storage | Local disk (`backend/uploads/`)                           |
| Frontend     | React 18 + TypeScript + Vite                              |
| Styling      | Tailwind CSS + shadcn/ui                                  |
| Charts       | Recharts                                                  |
| State/Data   | TanStack Query + Zustand                                  |
| AI           | Mock stub (IAiProvider interface — swap in OpenAI easily) |

---

## Quick Start

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # adjust values if needed
npm install
npm run migration:run         # apply DB migrations
npm run start:dev
```

Backend runs at **http://localhost:3000**

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Project Structure

```
bus-complaints/
├── docker-compose.yml
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── database/
│   │   │   └── entities/         ← TypeORM entities
│   │   ├── auth/                 ← JWT auth module
│   │   ├── users/                ← Users module
│   │   ├── complaints/           ← Complaints CRUD + file upload
│   │   ├── uploads/              ← File serving
│   │   ├── summary/              ← Monthly stats
│   │   └── ai/                   ← AI agent + skills (mock)
│   └── test/
└── frontend/
    └── src/
        ├── api/                  ← Axios clients
        ├── components/
        │   ├── complaints/       ← Upload form, table, detail
        │   ├── dashboard/        ← Charts, stat cards
        │   └── layout/           ← App shell, navbar
        ├── hooks/
        ├── pages/
        ├── store/                ← Zustand auth store
        └── types/
```

---

## API Reference

| Method | Path                       | Auth        | Description                     |
| ------ | -------------------------- | ----------- | ------------------------------- |
| POST   | `/auth/register`           | public      | Register user                   |
| POST   | `/auth/login`              | public      | Login → JWT                     |
| GET    | `/complaints`              | user        | List (filter, search, paginate) |
| POST   | `/complaints`              | user        | Create + upload file            |
| GET    | `/complaints/:id`          | owner/admin | Get detail                      |
| PATCH  | `/complaints/:id`          | admin       | Update metadata                 |
| DELETE | `/complaints/:id`          | admin       | Delete                          |
| POST   | `/complaints/:id/response` | owner/admin | Upload response file            |
| GET    | `/summary/monthly`         | user        | Monthly statistics              |
| POST   | `/ai/analyze/:id`          | admin       | Auto-categorize complaint       |
| POST   | `/ai/categorize-batch`     | admin       | Batch categorize all            |
| GET    | `/uploads/:folder/:file`   | owner/admin | Serve uploaded file             |

---

## Complaint Categories

`MISSED_BUS` · `LATE_BUS` · `SAFETY` · `DRIVER_BEHAVIOR` · `VEHICLE_CONDITION` · `OTHER`

---

## Environment Variables (backend)

| Variable           | Description            | Default          |
| ------------------ | ---------------------- | ---------------- |
| `DB_HOST`          | PostgreSQL host        | `localhost`      |
| `DB_PORT`          | PostgreSQL port        | `5432`           |
| `DB_USER`          | Database user          | `bususer`        |
| `DB_PASS`          | Database password      | `buspass`        |
| `DB_NAME`          | Database name          | `bus_complaints` |
| `JWT_SECRET`       | JWT signing secret     | _(required)_     |
| `JWT_EXPIRES_IN`   | Token expiry           | `7d`             |
| `UPLOADS_DIR`      | Path to uploads folder | `uploads`        |
| `MAX_FILE_SIZE_MB` | Max upload size in MB  | `10`             |
| `PORT`             | Server port            | `3000`           |

---

## Running Tests

```bash
# Backend unit tests
cd backend && npm test

# Backend test coverage
cd backend && npm run test:cov

# Frontend tests
cd frontend && npm test
```

---

## Swapping in Real AI

Implement `IAiProvider` in `backend/src/ai/interfaces/ai-provider.interface.ts` and register your implementation in `ai.module.ts` instead of `MockAiProvider`. No other changes needed.

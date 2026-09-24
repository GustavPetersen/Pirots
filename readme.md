# Pirots - Goofy Ahh Version!

## Frontend
The web client for our Pirots-style slot game. It renders the game, handles login and accounts, and talks to the backend API.

#### Stack
- **React + TypeScript** for pages and UI
- **Vite** for the dev server and builds
- **PixiJS** for rendering the game canvas
- **GSAP** for animations
- **Howler.js** for sound effects and music
- **React Router** for routing
- **TanStack Query** for API calls and caching

#### Getting Started
Requires Node.js 20 or newer.
```bash
cd frontend
npm install
npm run dev
```
The app runs at http://localhost:5173.

#### Scripts
 
| Command           | What it does                            |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload    |
| `npm run build`   | Type-check and build to `dist/`         |
| `npm run preview` | Serve the production build locally      |
| `npm run lint`    | Run ESLint                              |
 
#### Folder structure

```
frontend/
├── public/assets/   # Sprites, sounds, fonts
└── src/
    ├── api/         # Functions that call the backend
    ├── components/  # Reusable React components
    ├── game/        # PixiJS game code (scene, animations)
    ├── pages/       # Route pages (login, lobby, play)
    └── main.tsx     # Entry point
```
 
## Backend
The API server for the game. It handles accounts and sessions, the wallet, spins and leaderboards, and runs the game engine, so all spin outcomes are decided here and never in the browser.

#### Stack
- **Go** for the server
- **chi** for routing and middleware
- **pgx** as the PostgreSQL driver
- **sqlc** for generating type-safe Go code from SQL queries
- **goose** for database migrations (run automatically on startup)
- **scs** for session cookies
- **argon2id** for password hashing
- **PostgreSQL** as the database

#### Getting Started
Requires Go and Docker.

Start a local database:
```bash
docker run -d --name pirots-db -p 5432:5432 \
  -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=pirots postgres:17-alpine
```

Run the server:
```bash
cd backend
cp ../.env.example .env
DATABASE_URL=postgres://postgres:dev@localhost:5432/pirots 
go run ./cmd/server
```

The API runs at http://localhost:3000. Check it with `curl localhost:3000/api/health`.

#### Environment variables

| Variable         | What it is                                  |
| ---------------- | ------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string                |
| `SESSION_SECRET` | Secret for signing session cookies          |
| `PORT`           | Port to listen on (defaults to `3000`)      |


#### Commands

| Command                    | What it does                                |
| -------------------------- | ------------------------------------------- |
| `go run ./cmd/server`      | Start the API server                        |
| `go run ./cmd/sim`         | Run the Monte Carlo simulator (RTP, hit rate) |
| `go test ./...`            | Run all tests                               |
| `sqlc generate`            | Regenerate Go code from `db/queries/`       |

See [`backend/cmd/sim/README.md`](backend/cmd/sim/README.md) for how to use the simulator to balance the game.

#### Folder structure

```
backend/
├── cmd/
│   ├── server/      # API entry point
│   └── sim/         # Simulator for balancing the game
├── db/
│   ├── migrations/  # SQL migrations (goose)
│   └── queries/     # SQL queries used by sqlc
└── internal/
    ├── api/         # HTTP handlers
    ├── auth/        # Sessions and password hashing
    ├── engine/      # Game logic (no HTTP or DB code)
    └── store/       # sqlc-generated database code
```

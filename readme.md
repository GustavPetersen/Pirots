# Pirots - Goofy Ahh Version!

## Frontend
The web client for our Pirots-style slot game. It renders the game, handles login and accounts, and talks to the backend API.

### Stack
- **React + TypeScript** for pages and UI
- **Vite** for the dev server and builds
- **PixiJS** for rendering the game canvas
- **GSAP** for animations
- **Howler.js** for sound effects and music
- **React Router** for routing
- **TanStack Query** for API calls and caching

### Development
Requires Docker.
```bash
cp .env.dev.example .env
docker compose -f docker-compose-dev.yml up --build --watch
```
The app runs at http://localhost:5173. Changes to files under the frontend/src directory are immediately synced to the container and hot reloaded (may require f5 in the browser). If any changes ar are made to the frontend outside the source folder, the docker image must be rebuilt (just run the command again).

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

### Production
Requires docker. 
```bash
cp .env.prod.example .env
docker compose -f docker-compose-prod.yml up --build
```
The production image build pipeline is now seperate from the the dev pipeline. It is currently not implemented, instead just being identical to the old Docker compose setup. If you for any reason wish to run the old compose file, run this.
 
## Backend
The API server for the game. It handles accounts and sessions, the wallet, spins and leaderboards, and runs the game engine, so all spin outcomes are decided here and never in the browser.

### Stack
- **Go** for the server
- **chi** for routing and middleware
- **pgx** as the PostgreSQL driver
- **sqlc** for generating type-safe Go code from SQL queries
- **goose** for database migrations (run automatically on startup)
- **scs** for session cookies
- **argon2id** for password hashing
- **PostgreSQL** as the database

### Development
Requires Docker. Note that the below commands are exactly equal to the ones from the frontend. This is because the docker-compose-dev.yml file sets up the complete system (both frontend and backend). 
```bash
cp .env.dev.example .env
docker compose -f docker-compose-dev.yml up --build --watch
```
The API runs at http://localhost:3000. Check it with `curl localhost:3000/api/health`.
Changes to files under the backend/ directory are immediately synced to the container and hot reloaded.

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

### Production
Requires docker. 
```bash
cp .env.prod.example .env
docker compose -f docker-compose-prod.yml up --build
```
Again these commands are equal to the ones from the frontend, due to docker-compose-prod.yml also orchestrating the entire system. 

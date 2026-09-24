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
 

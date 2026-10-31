# My-Cozy-Portfolio

An isometric 2.5D interactive portfolio where you can view my projects while exploring the game world. The project uses Phaser 4 with the Phaser Next.js template's React bridge and TypeScript setup.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080). The Next.js app is in `src/pages`, the Phaser/React bridge is in `src/PhaserGame.tsx`, and game scenes are in `src/game/scenes`.

Create a production build with:

```bash
npm run build
```

The GitHub stats in the sidebar need a `GITHUB_TOKEN` environment variable (a fine-grained token with no repository permissions is enough). Put it in `.env` locally, and in the project's environment variables when deploying.

# Nexus Hub

Nexus Hub is a monorepo with separate frontend and backend workspaces:

- `apps/web` contains the React and Vite frontend.
- `apps/api` contains the Express API and Prisma database layer.

## Development

Install dependencies from the repository root:

```sh
npm install
```

Run the frontend with `npm run dev:frontend`. Run both workspaces with `npm run dev`.
The API also requires an `apps/api/.env` file based on `apps/api/.env.example`.

Run the production build with `npm run build` and lint both workspaces with `npm run lint`.

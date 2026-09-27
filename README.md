# Nexus Hub

Nexus Hub is a monorepo with a root-level React application and separate frontend and backend workspaces:

- `src` contains the React application and its pages/components.
- `apps/web` provides the Vite workspace that serves and builds the root-level application.
- `apps/api` contains the Express API and Prisma database layer.

## Development

Install dependencies from the repository root:

```sh
npm install
```

Run the frontend with `npm run dev:frontend`. Run both workspaces with `npm run dev`.
The API also requires an `apps/api/.env` file based on `apps/api/.env.example`.

Run the production build with `npm run build` and lint both workspaces with `npm run lint`.

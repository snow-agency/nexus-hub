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

## Deployment (Vercel)

The frontend and the API are deployed as two separate Vercel projects from the same repository.

**Frontend** — Root Directory `apps/web` (configured by `apps/web/vercel.json`). Set the environment variable `VITE_API_URL` to the public URL of the API project (no trailing slash), then redeploy: Vite reads it at build time.

**API** — Root Directory `apps/api` (configured by `apps/api/vercel.json`). The Express app from `src/app.ts` is exposed as a serverless function through `apps/api/api/index.js`, and every route is rewritten to it. Set these environment variables:

- `DATABASE_URL`: the Supabase pooler URL in "Transaction" mode (port 6543, see `apps/api/.env.example`).
- `JWT_SECRET`: a long random string.

Check the deployment with `GET <api-url>/health`, which must answer `{"status":"ok"}`. Database migrations are not run by Vercel: run `npx prisma migrate deploy` from `apps/api` on your machine, with `DATABASE_URL` pointing to the production database.

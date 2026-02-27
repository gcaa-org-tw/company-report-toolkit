# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a toolkit to transform ESG (corporate sustainability) reports (PDF) into structured, machine-readable data. It supports GCAA's (台灣公司治理協會) "工人智慧補完計畫" project.

The monorepo contains three sub-projects:

- **`report-preprocessing/`** — Node.js scripts (ESM) that process raw PDFs: split them, upload to Algolia for search, and generate seed YAML files for the API.
- **`toolkit-api/`** — Feathers.js v5 + Koa REST/WebSocket API (TypeScript), backed by SQLite (dev) or PostgreSQL (prod).
- **`toolkit-ui/`** — Nuxt 3 / Vue 3 SPA (TypeScript, SSR disabled) for annotators to review ESG data.
- **`toolkit-sh/`** — Shell scripts and Docker Compose for database backup/restore with PostgreSQL.

## Development Setup

Each sub-project has a `.nvmrc` specifying the required Node.js version. Run `nvm use` in the sub-project directory before installing dependencies or starting the server.

### toolkit-api (Backend)

```bash
cd toolkit-api
nvm use               # apply Node version from .nvmrc
cp env.example .env   # fill in Auth0 credentials
npm install
npm run migrate       # runs knex migrations
npm run dev           # ts-node with nodemon, port 3030
```

Run tests:
```bash
npm test              # runs migrate + mocha
npm run mocha         # mocha only (test/ dir, .ts extension)
```

Seeding data (run after migrations, in order):
```bash
npx ts-node seeds/seed-company.ts
npx ts-node seeds/seed-field-meta.ts
npx ts-node seeds/seed-report.ts
npx ts-node seeds/seed-report-field.ts
```

### toolkit-ui (Frontend)

```bash
cd toolkit-ui
nvm use               # apply Node version from .nvmrc
cp env.example .env
npm install
npm run dev           # Nuxt dev server, port 3000
npm run lint          # ESLint for .ts, .js, .vue
npm run build         # production build
```

### report-preprocessing

```bash
cd report-preprocessing
cp env.example .env   # Algolia credentials
npm install
# Process PDFs and upload to Algolia + split files:
node ./process-reports.js -s report1.pdf report2.pdf
# Generate seed YAML only (no Algolia/splitting):
node ./gen-report-seed.js report1.pdf report2.pdf
```

External system dependencies for PDF processing: `cpdf`, `ghostscript`, Java (for `pdf2html`).

## Architecture

### Data Model (toolkit-api)

The core Feathers services map to these database entities:
- **`company`** — Tax ID (`统编`), name, abbreviation, industry, stock code
- **`report`** — One per (company × year), tracks `totalPages`, `answeredFields`, `timeSpentInSeconds`
- **`field-meta`** — ESG field definitions loaded from `seeds/field-meta.csv` (sourced from a shared Google Spreadsheet)
- **`report-field`** — Answers/annotations linking a report to a field-meta entry; stores `value`, `notes`, `pageIndex`, `hasAdminEdited`
- **`users`** — Auth0-authenticated users with `role` (`admin` | `collaborator`)

All services use `@feathersjs/knex` (KnexService). The database client is exposed on the app as `rdbClient`.

### Authentication (toolkit-api)

Auth is Auth0-based JWT (RS256). The frontend acquires an access token via Auth0, sends it to the Feathers API which validates it with the Auth0 RS256 public key. There is no username/password flow. Required env vars: `AUTH0_RS256_PUBLIC_KEY`, `AUTH0_CLIENT_ID`, `AUTH0_SECRET`, `AUTH0_SUBDOMAIN`.

Authorization hooks in `src/hooks/authorization.ts`: `atLeastCollaborator` and `mustBeAdmin`.

### Frontend–Backend Connection (toolkit-ui)

The UI connects via Socket.IO using `@feathersjs/socketio-client`. The `useProfessionApi` composable (`composables/useProfessionApi.ts`) manages the entire Auth0 login flow and Feathers client initialization. The `FeathersApp` class is a singleton that wraps the Feathers client.

Runtime config keys: `apiEndpoint`, `auth0Domain`, `auth0ClientId`, `algoliaAppId`, `algoliaSearchApiKey`, `algoliaIndexName`.

### PDF Preprocessing Pipeline

1. `process-reports.js` orchestrates: calls `build-index.js` (Algolia indexing) + `split-n-minify.sh` (cpdf + ghostscript) for each PDF.
2. PDF filename format determines company lookup: `<year>_<stockId>_<name>.pdf`, `<companyId>-<name>-<year>.pdf`, or legacy `<stockId>_<twYear>_<companyId>.pdf`.
3. `companyList.csv` maps between company names, abbreviations, stock codes, and tax IDs (统编).
4. Output is a `report-list.yml` seed file consumed by `toolkit-api/seeds/seed-report.ts`.

### Adding a New Feathers Service

```bash
cd toolkit-api
npx feathers generate service
```

This scaffolds `service.ts`, `service.class.ts`, `service.schema.ts`, `service.shared.ts` in `src/services/<name>/`.

### Database (toolkit-api)

- **Dev**: SQLite (`toolkit-api.sqlite`) — default, no setup needed
- **Prod**: PostgreSQL — set `PROD_DB_CLIENT=pg` and `PROD_DB_CONNECTION_STRING` env vars
- Migrations: `npm run migrate` (knex) — migration files in `migrations/`
- New migration: `npm run migrate:make -- <name>`

### toolkit-sh

Docker Compose runs a bare PostgreSQL 16 container with `backup-psql.sh` and `restore-psql.sh` mounted for backup operations. SQL dumps are stored in `backups/`.

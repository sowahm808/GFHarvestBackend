# High‑Ticket Deal Closer API (NestJS)

This repository contains a minimal backend API for managing leads, deals, proposals and payments.
It is built with **NestJS**, **Prisma** (PostgreSQL), **Stripe** and **Firebase Admin**.

## Features
- Firebase authentication guard.
- CRUD endpoints for leads and deals.
- Proposal creation and stubbed send action.
- Stripe checkout sessions and webhook handler.
- Prisma schema for multi‑tenant CRM domain.

## Requirements
- Node.js 18+
- PostgreSQL database (or use `docker-compose.yml`).

## Setup
```bash
npm install
cp .env.example .env   # fill in environment variables
npx prisma migrate dev --name init
npm run dev
```

The API will be available at `http://localhost:4000/v1` by default.

## Scripts
- `npm run dev` – start development server with `ts-node-dev`.
- `npm run build` – compile TypeScript.
- `npm run prisma:generate` – generate Prisma client.
- `npm run prisma:migrate` – run database migrations.

## Notes
This is an MVP. Proposal sending is a stub and should be replaced with an actual DocuSign (or similar) integration. Add rate limiting, logging and proper multi‑tenant handling before production use.

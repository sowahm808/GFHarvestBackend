# Kids Faith Tracker Backend

This repository contains a Node.js Express backend integrated with Firebase Admin SDK. It provides REST API routes for managing users and daily check-ins for children.

## Setup

1. Copy `.env.example` to `.env`. Set `GOOGLE_APPLICATION_CREDENTIALS` to the full path of your Firebase service account JSON and update the `FIREBASE_PROJECT_ID`.
2. Install dependencies with `npm install` (internet access required).
3. Start the development server:

```bash
node src/index.js
```

## Available Routes

- `POST /api/users/register-parent` – Create a parent account.
- `POST /api/users/add-child` – Add a child account (parent only).
- `GET  /api/users/me` – Retrieve the current user's profile.
- `POST /api/checkins` – Submit a check-in entry.
- `GET  /api/checkins/:childId` – Get check-ins for a specific child.
- `POST /api/mental-status` – Submit a mental status entry.
- `GET  /api/mental-status/:childId` – Get mental status logs for a child.

Authentication is performed via Firebase ID tokens passed in the `Authorization` header.
The `authMiddleware` verifies the token and attaches the authenticated user's
claims to `req.user`. The optional `roleGuard` middleware restricts access to
routes based on custom `role` claims (`parent`, `child`, or `mentor`).

## Testing

Run `npm test` once you have added test cases.

## Roadmap

See [TODO.md](TODO.md) for planned features and tasks.

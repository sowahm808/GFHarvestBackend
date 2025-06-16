# Kids Faith Tracker Backend

This repository contains a Node.js Express backend integrated with Firebase Admin SDK. It provides REST API routes for managing users and daily check-ins for children.

## Setup

1. Copy `.env.example` to `.env` and update the Firebase credentials and project information.
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

Authentication is performed via Firebase ID tokens passed in the `Authorization` header.

## Testing

Run `npm test` once you have added test cases.

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
- `GET  /api/children/:childId` – Get a child's profile and mentors.
- `POST /api/mentors/assign` – Assign a mentor to a child (parent only).
- `GET  /api/mentors/:mentorId/children` – List children assigned to a mentor.
- `GET  /api/quizzes/today` – Get today’s quiz.
- `POST /api/quizzes/submit` – Submit quiz answers.
- `GET  /api/quizzes/history/:childId` – Quiz history.
- `POST /api/essays` – Create or update essay status.
- `GET  /api/essays/:childId` – Get essay progress.
- `POST /api/schoolwork` – Submit school work score.
- `GET  /api/schoolwork/:childId` – Get school work records.
- `POST /api/projects` – Submit or update project entry.
- `GET  /api/projects/:childId` – Get project entries.
- `POST /api/points/grant` – Grant points.
- `GET  /api/points/:childId` – Get points for a child.
- `GET  /api/groups/:groupId/points` – Get total points for a group.

Authentication is performed via Firebase ID tokens passed in the `Authorization` header.
The `authMiddleware` verifies the token and attaches the authenticated user's
claims to `req.user`. The optional `roleGuard` middleware restricts access to
routes based on custom `role` claims (`parent`, `child`, or `mentor`).

## Testing

Run `npm test` once you have added test cases.

## Roadmap

See [TODO.md](TODO.md) for planned features and tasks.

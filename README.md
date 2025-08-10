# Kids Faith Tracker Backend

This repository contains a Node.js Express backend integrated with Firebase Admin SDK. It provides REST API routes for managing users and daily check-ins for children.

## Setup

1. Clone this repository and copy `.env.example` to `.env`.
   - Either set `FIREBASE_SERVICE_ACCOUNT` to the JSON for your service account (optionally base64 encoded)
     **or** set `GOOGLE_APPLICATION_CREDENTIALS` to the path of that JSON file.
   - `FIREBASE_PROJECT_ID` must match your Firebase project.
   - `PORT` sets the Express port (defaults to 3000).
2. Create a Firebase service account and provide its credentials using one of the methods above.
3. Install dependencies with `npm install` (requires internet access).
4. Start the development server:

```bash
node src/index.js
```

5. Run the unit tests:

```bash
npm test
```

## Available Routes

- `POST /api/users/register-parent` – Create a parent account.
- `POST /api/users/register-admin` – Create an admin account.
- `POST /api/users/set-admin` – Grant admin role to a user (admin only).
- `POST /api/users/assign-role` – Assign mentor, child, or parent role to a user (admin only).
- `POST /api/users/add-child` – Add a child account with name and age (parent only). Uses the Firebase Admin SDK so the parent remains signed in while the server writes the child profile.
- `GET  /api/users/me` – Retrieve the current user's profile.
- `POST /api/checkins` – Submit a check-in entry.
- `GET  /api/checkins/:childId` – Get check-ins for a specific child.
- `POST /api/mental-status` – Submit a mental status entry.
- `GET  /api/mental-status/:childId` – Get mental status logs for a child.
- `GET  /api/children/:childId` – Get a child's profile, age and mentors.
- `POST /api/mentors` – Add a mentor profile (admin only). Legacy support: `POST /api/mentors/create`.
- `POST /api/mentors/assign` – Assign a mentor to a child (parent only).
- `GET  /api/mentors/:mentorId/children` – List children assigned to a mentor.
- `POST /api/mentors/records` – Create a mentor progress note.
- `GET  /api/mentors/:childId/records` – Get notes for a child.
- `GET  /api/quizzes/today` – Get today’s quiz.
- `POST /api/quizzes/submit` – Submit quiz answers.
- `GET  /api/quizzes/history/:childId` – Quiz history.
- `GET  /api/bible-questions` – List Bible quiz questions (filter by quarter).
- `GET  /api/bible-questions/:id` – Get a specific Bible question.
- `POST /api/essays` – Create or update essay status.
- `GET  /api/essays/:childId` – Get essay progress.
- `POST /api/schoolwork` – Submit school work score.
- `GET  /api/schoolwork/:childId` – Get school work records.
- `POST /api/projects` – Submit or update project entry.
- `GET  /api/projects/:childId` – Get project entries.
- `POST /api/points/grant` – Grant points.
- `GET  /api/points/:childId` – Get points for a child.
- `GET  /api/groups/:groupId/points` – Get total points for a group.
- `GET  /api/groups/points` – Get total points for all groups.
- `POST /api/groups/create` – Create a group (max 5 members).
- `POST /api/groups/add-member` – Add a child to a group.
- `GET  /api/groups/:groupId` – View group info.
- `GET  /api/groups` – List all groups (admin only).

Authentication is performed via Firebase ID tokens passed in the `Authorization` header.
The `authMiddleware` verifies the token and attaches the authenticated user's
claims to `req.user`. The optional `roleGuard` middleware restricts access to
routes based on custom `role` claims (`parent`, `child`, `mentor`, or `admin`).

## Testing

This project uses **Jest**. After installing dependencies run:

```bash
npm test
```

## Roadmap

See [TODO.md](TODO.md) for planned features and tasks.

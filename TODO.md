# 📌 TODO List: Backend Services for Kids Faith Tracker

## 🔧 Setup
- [x] Initialize Node.js project with `express`, `firebase-admin`, `cors`, `dotenv`
- [x] Connect Firebase Admin SDK for Firestore and Auth
- [x] Configure environment variables (.env)
- [x] Set up Express app with routes structure

## 🔐 Authentication Middleware
- [x] Verify Firebase ID Token
- [x] Role-based access check (parent, child, mentor)
- [x] Middleware: `authMiddleware.js`, `roleGuard.js`

## 👤 User Management
- [x] POST `/api/users/register-parent` – Create parent account (Firebase Auth)
- [x] POST `/api/users/add-child` – Link child account to parent
- [x] GET `/api/users/me` – Get current user profile

## 👨‍👩‍👧 Child & Mentor Linking
 - [x] GET `/api/children/:childId` – Get child profile & linked data
 - [x] POST `/api/mentors/assign` – Assign mentor to child
 - [x] GET `/api/mentors/:mentorId/children` – List assigned children

## 📆 Daily Check-Ins
 - [x] POST `/api/checkins` – Submit check-in
 - [x] GET `/api/checkins/:childId` – Get child’s check-ins

## 🧠 Mental Status Logs
 - [x] POST `/api/mental-status` – Submit mental health entry
 - [x] GET `/api/mental-status/:childId` – Retrieve mental logs

## 📖 Bible Quizzes
- [ ] GET `/api/quizzes/today` – Get today’s quiz
- [ ] POST `/api/quizzes/submit` – Submit quiz answers
- [ ] GET `/api/quizzes/history/:childId` – Quiz history

## 📝 Essays
- [ ] POST `/api/essays` – Create or update essay status
- [ ] GET `/api/essays/:childId` – Get essay progress

## 📚 School Work
- [ ] POST `/api/schoolwork` – Submit score and help flag
- [ ] GET `/api/schoolwork/:childId`

## 🎓 Project Tracker
- [ ] POST `/api/projects` – Submit/update project entry
- [ ] GET `/api/projects/:childId`

## 🧮 Points System
- [ ] POST `/api/points/grant` – Assign points (activity, parent feedback)
- [ ] GET `/api/points/:childId` – Get individual points
- [ ] GET `/api/groups/:groupId/points` – Group total points

## 👥 Groups
- [ ] POST `/api/groups/create` – Create group (max 5 members)
- [ ] POST `/api/groups/add-member` – Add child to group
- [ ] GET `/api/groups/:groupId` – View group info and members
- [ ] GET `/api/groups` – List all groups (admin use)

## 🔔 Notifications (Future Phase)
- [ ] Trigger email or in-app alert for bullying flags
- [ ] Weekly summary to parents
- [ ] Reminder jobs for quiz, essay, project deadlines

## 🧪 Testing
- [ ] Setup Jest or Mocha/Chai for unit tests
- [ ] Write test cases for core routes and utilities

## 📄 Documentation
- [ ] Create OpenAPI/Swagger spec for all endpoints
- [ ] Include roles and expected responses for each
- [ ] Add setup guide for local dev and Firebase config

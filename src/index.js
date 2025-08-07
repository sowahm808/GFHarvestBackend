const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/firebase'); // make sure this file exists

const checkinsRoutes = require('./routes/checkins');
const usersRoutes = require('./routes/users');
const mentalRoutes = require('./routes/mentalStatus');
const childrenRoutes = require('./routes/children');
const mentorsRoutes = require('./routes/mentors');
const quizzesRoutes = require('./routes/quizzes');
const bibleQuestionsRoutes = require('./routes/bibleQuestions');
const essaysRoutes = require('./routes/essays');
const schoolworkRoutes = require('./routes/schoolwork');
const projectsRoutes = require('./routes/projects');
const pointsRoutes = require('./routes/points');
const groupsRoutes = require('./routes/groups');
const parentChildRoutes = require('./routes/parentChild');

const app = express();

// Configure CORS to allow requests from the production frontend and handle
// preflight requests.  This ensures the `Access-Control-Allow-Origin` header
// is present on all responses.
const allowedOrigins = [
  'https://kidsfaithtracker.netlify.app',
  'http://localhost:3000', // local development
];
const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Explicitly handle preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/api/checkins', checkinsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/mental-status', mentalRoutes);
app.use('/api/children', childrenRoutes);
// Support legacy singular `/api/child` paths used by older clients
app.use('/api/child', childrenRoutes);
app.use('/api/mentors', mentorsRoutes);
// Support legacy singular `/api/mentor` paths used by older clients
app.use('/api/mentor', mentorsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/bible-questions', bibleQuestionsRoutes);
app.use('/api/essays', essaysRoutes);
app.use('/api/schoolwork', schoolworkRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/parent-child', parentChildRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Kids Faith Tracker API' });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;

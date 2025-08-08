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
// preflight requests so that browsers see the required
// `Access-Control-Allow-Origin` header on every response.
const allowedOrigins = [
  'https://kidsfaithtracker.netlify.app',
  'http://localhost:3000'
];

// Dynamic CORS origin check
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight for all routes

app.use(express.json());

// Routes
app.use('/api/checkins', checkinsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/mental-status', mentalRoutes);
// Primary routes
app.use('/api/children', childrenRoutes);
app.use('/api/mentors', mentorsRoutes);
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

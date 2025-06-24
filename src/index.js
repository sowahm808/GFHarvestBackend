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
const essaysRoutes = require('./routes/essays');
const schoolworkRoutes = require('./routes/schoolwork');
const projectsRoutes = require('./routes/projects');
const pointsRoutes = require('./routes/points');
const groupsRoutes = require('./routes/groups');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/checkins', checkinsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/mental-status', mentalRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/essays', essaysRoutes);
app.use('/api/schoolwork', schoolworkRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/groups', groupsRoutes);

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

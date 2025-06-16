const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/firebase'); // make sure this file exists

const checkinsRoutes = require('./routes/checkins');
const usersRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/checkins', checkinsRoutes);
app.use('/api/users', usersRoutes);

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

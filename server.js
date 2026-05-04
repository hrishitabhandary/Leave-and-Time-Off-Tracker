const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/users');
const leavesRouter = require('./routes/leaves');
const managersRouter = require('./routes/managers');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/leaves', leavesRouter);
app.use('/api/managers', managersRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Leave Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
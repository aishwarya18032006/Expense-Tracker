const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const transRoutes = require('./routes/transactions');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.js (only the relevant additions shown)
const userRoutes = require('./routes/users');

app.use('/api/users', userRoutes);

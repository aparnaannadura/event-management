const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./config/db');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.get('/', (req, res) => {
  res.send('event maagement is running');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

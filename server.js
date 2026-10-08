require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const origins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((s) => s.trim());
app.use(cors({ origin: origins }));
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', service: 'Employee Management API' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });

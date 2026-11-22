require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database (or initialize in-memory fallback)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CampusZon UC Berkeley Backend Server is running!`);
    console.log(`📡 API Base URL:  http://localhost:${PORT}/api`);
    console.log(`💻 Frontend App:  http://localhost:${PORT}/`);
    console.log(`⚡ Health Check:  http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
};

startServer();

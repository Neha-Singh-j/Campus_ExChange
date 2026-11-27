require('dotenv').config();
const fs = require('fs');
const config = require('./config'); // validates required settings (throws in production without JWT_SECRET)
const app = require('./app');
const { connectDB } = require('./config/db');
const { UPLOAD_DIR } = require('./utils/imageStore');

const start = async () => {
  await connectDB();
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  app.listen(config.port, () => {
    console.log('=======================================================');
    console.log('Campus Exchange API is running');
    console.log(`  API:      http://localhost:${config.port}/api`);
    console.log(`  Health:   http://localhost:${config.port}/api/health`);
    console.log(`  Campus:   ${config.campusId} (emails: ${config.allowedEmailDomains.map((d) => `@${d}`).join(', ')})`);
    console.log(`  Email:    ${config.brevoConfigured ? 'Brevo API' : config.smtpConfigured ? 'SMTP' : 'console only (set BREVO_API_KEY or SMTP_* to send real emails)'}`);
    console.log(`  Images:   ${config.cloudinaryConfigured ? 'Cloudinary' : 'local ./uploads folder'}`);
    console.log('=======================================================');
  });
};

start();

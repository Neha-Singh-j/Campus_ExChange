const multer = require('multer');
const config = require('../config');
const AppError = require('../utils/AppError');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.limits.maxImageBytes, files: config.limits.maxImages },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    cb(ok ? null : new AppError(400, 'Only JPG, PNG or WebP images are allowed.', 'BAD_IMAGE'), ok);
  },
});

module.exports = { listingImages: upload.array('images', config.limits.maxImages) };

const mongoose = require('mongoose');

const notFound = (req, res) => {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: `Endpoint not found: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.expose ? err.message : 'Something went wrong. Please try again.';
  let code = err.code;

  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    code = 'VALIDATION';
    message = Object.values(err.errors).map((e) => e.message).join(' ');
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    code = 'BAD_ID';
    message = 'Invalid identifier.';
  } else if (err && err.code === 11000) {
    status = 409;
    code = 'DUPLICATE';
    message = 'That record already exists.';
  } else if (err && err.name === 'MulterError') {
    status = 400;
    code = 'BAD_UPLOAD';
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Each image must be 5 MB or smaller.'
        : err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'You can upload at most 5 images.'
          : 'Upload failed.';
  } else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    status = 400;
    code = 'BAD_JSON';
    message = 'Malformed JSON body.';
  }

  if (status >= 500) console.error('API error:', err.stack || err);

  res.status(status).json({ success: false, code, message });
};

module.exports = { errorHandler, notFound };

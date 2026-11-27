const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const config = require('../config');
const AppError = require('./AppError');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

let cloudinary = null;
const getCloudinary = () => {
  if (!config.cloudinaryConfigured) return null;
  if (!cloudinary) {
    cloudinary = require('cloudinary').v2;
    // CLOUDINARY_URL is picked up automatically; otherwise use the individual variables.
    if (!process.env.CLOUDINARY_URL) cloudinary.config({ ...config.cloudinary, secure: true });
  }
  return cloudinary;
};

/** Detects the real image type from the file's first bytes (the client-sent type can be faked). */
const sniffExtension = (buf) => {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg';
  if (buf.length > 12 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
  if (buf.length > 12 && buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return '.webp';
  return null;
};

const uploadToCloudinary = (cld, buffer) =>
  new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder: 'campus-exchange/listings',
        resource_type: 'image',
        transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }],
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

/** Validates and stores uploaded files; returns [{ url, publicId, storage }]. */
const saveImages = async (files = []) => {
  const checked = files.map((file) => {
    const ext = sniffExtension(file.buffer);
    if (!ext) throw new AppError(400, 'Only real JPG, PNG or WebP images are allowed.', 'BAD_IMAGE');
    return { file, ext };
  });

  const saved = [];
  try {
    const cld = getCloudinary();
    for (const { file, ext } of checked) {
      if (cld) {
        const result = await uploadToCloudinary(cld, file.buffer);
        saved.push({ url: result.secure_url, publicId: result.public_id, storage: 'cloudinary' });
      } else {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        const name = `${crypto.randomBytes(16).toString('hex')}${ext}`;
        await fs.writeFile(path.join(UPLOAD_DIR, name), file.buffer);
        saved.push({ url: `${config.publicUrl}/uploads/${name}`, publicId: name, storage: 'local' });
      }
    }
  } catch (err) {
    await deleteImages(saved);
    throw err;
  }
  return saved;
};

/** Best-effort removal; never throws. */
const deleteImages = async (images = []) => {
  await Promise.all(
    images.map(async (img) => {
      try {
        if (img.storage === 'external') return; // not ours to delete (e.g. demo seed images)
        if (img.storage === 'cloudinary') {
          const cld = getCloudinary();
          if (cld) await cld.uploader.destroy(img.publicId);
        } else {
          // basename() guards against path traversal
          await fs.unlink(path.join(UPLOAD_DIR, path.basename(img.publicId)));
        }
      } catch (err) {
        console.warn('[images] could not delete', img.publicId, err.message);
      }
    })
  );
};

module.exports = { saveImages, deleteImages, UPLOAD_DIR };

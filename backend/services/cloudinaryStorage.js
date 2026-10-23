const { createHash, randomUUID } = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const uploadToCloudinary = async (file, { resourceType, folder, publicId }) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!isCloudinaryConfigured()) {
    const label = resourceType === 'raw' ? 'Resume' : 'Image';
    const error = new Error(
      `${label} storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the backend.`
    );
    error.statusCode = 503;
    throw error;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureParams = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = createHash('sha1')
    .update(`${signatureParams}${CLOUDINARY_API_SECRET}`)
    .digest('hex');
  const fileBuffer = file.buffer || await fs.readFile(file.path);
  const form = new FormData();
  form.append('file', new Blob([fileBuffer], { type: file.mimetype }), path.basename(file.originalname || publicId));
  form.append('api_key', CLOUDINARY_API_KEY);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('public_id', publicId);
  form.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUDINARY_CLOUD_NAME)}/${resourceType}/upload`,
    { method: 'POST', body: form }
  );
  let result;
  try {
    result = await response.json();
  } catch {
    const error = new Error('Persistent storage returned an invalid upload response.');
    error.statusCode = 502;
    throw error;
  }

  if (!response.ok || !result.secure_url) {
    const error = new Error(result.error?.message || 'Upload to persistent storage failed.');
    error.statusCode = response.status >= 500 ? 502 : 400;
    throw error;
  }

  let secureUrl;
  try {
    secureUrl = new URL(result.secure_url);
  } catch {
    const error = new Error('Persistent storage returned an invalid public file URL.');
    error.statusCode = 502;
    throw error;
  }

  const expectedPath = `/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/`;
  if (
    secureUrl.protocol !== 'https:' ||
    secureUrl.hostname !== 'res.cloudinary.com' ||
    !secureUrl.pathname.startsWith(expectedPath)
  ) {
    const error = new Error('Persistent storage returned an invalid public file URL.');
    error.statusCode = 502;
    throw error;
  }

  return secureUrl.toString();
};

const uploadResume = (file) =>
  uploadToCloudinary(file, {
    resourceType: 'raw',
    folder: 'faculty-resumes',
    publicId: `faculty-resume-${randomUUID()}.pdf`,
  });

const uploadImage = (file) => {
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    const error = new Error('Only image files can be uploaded to gallery storage.');
    error.statusCode = 400;
    throw error;
  }

  return uploadToCloudinary(file, {
    resourceType: 'image',
    folder: 'gallery',
    publicId: `gallery-${randomUUID()}`,
  });
};

const uploadPYQPdf = async (file) => {
  if (file.mimetype !== 'application/pdf') {
    const error = new Error('Invalid question paper file. Select a PDF document.');
    error.statusCode = 400;
    throw error;
  }

  const buffer = file.buffer || await fs.readFile(file.path);
  if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
    const error = new Error('Invalid question paper file. Select a valid PDF document.');
    error.statusCode = 400;
    throw error;
  }

  return uploadToCloudinary(
    { ...file, buffer },
    {
      resourceType: 'raw',
      folder: 'pyqs',
      publicId: `pyq-${randomUUID()}.pdf`,
    }
  );
};

module.exports = { uploadResume, uploadImage, uploadPYQPdf, isCloudinaryConfigured };

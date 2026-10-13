const { createHash, randomUUID } = require('crypto');

const uploadResume = async (file) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const error = new Error(
      'Resume storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the backend.'
    );
    error.statusCode = 503;
    throw error;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `faculty-resume-${randomUUID()}.pdf`;
  const folder = 'faculty-resumes';
  const signatureParams = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = createHash('sha1')
    .update(`${signatureParams}${CLOUDINARY_API_SECRET}`)
    .digest('hex');
  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: 'application/pdf' }), publicId);
  form.append('api_key', CLOUDINARY_API_KEY);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('public_id', publicId);
  form.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUDINARY_CLOUD_NAME)}/raw/upload`,
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
    const error = new Error(result.error?.message || 'Resume upload to persistent storage failed.');
    error.statusCode = response.status >= 500 ? 502 : 400;
    throw error;
  }

  return result.secure_url;
};

module.exports = { uploadResume };

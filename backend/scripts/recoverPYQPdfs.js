const fs = require('fs');
const path = require('path');

const BACKEND_URL = process.env.API_URL || 'https://tpcollege-backend.onrender.com/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tpcollege.ac.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@SecurePassword123';

// Potential directories where original PDF copies might reside
const SEARCH_DIRS = [
  'C:\\Users\\Sona\\Desktop',
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../../uploads'),
];

async function recoverPYQs() {
  console.log('🔍 Checking production PYQs on:', BACKEND_URL);

  // 1. Authenticate with admin account
  console.log('Authenticating as admin...');
  const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const loginJson = await loginRes.json();
  if (!loginJson.success || !loginJson.data?.token) {
    throw new Error(`Login failed: ${loginJson.message || 'No token received'}`);
  }
  const token = loginJson.data.token;
  console.log('✅ Admin authenticated successfully.\n');

  // 2. Fetch all question papers
  const listRes = await fetch(`${BACKEND_URL}/pyqs?all=true`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listJson = await listRes.json();
  const papers = listJson.data || [];
  console.log(`📋 Found ${papers.length} total question papers.`);

  const legacyPapers = papers.filter((p) => p.fileUrl && p.fileUrl.startsWith('/uploads/'));
  console.log(`⚠️  ${legacyPapers.length} question papers have legacy ephemeral (/uploads/...) URLs:\n`);

  for (const paper of legacyPapers) {
    console.log(`────────────────────────────────────────────────────────────`);
    console.log(`ID:        ${paper._id || paper.id}`);
    console.log(`Title:     ${paper.title} (${paper.year || 'N/A'})`);
    console.log(`File Name: ${paper.fileName}`);
    console.log(`File URL:  ${paper.fileUrl}`);

    // Check if original file is found in search directories
    let localPath = null;
    for (const dir of SEARCH_DIRS) {
      if (fs.existsSync(dir)) {
        const candidate = path.join(dir, paper.fileName);
        if (fs.existsSync(candidate)) {
          localPath = candidate;
          break;
        }
      }
    }

    if (!localPath) {
      console.log(`❌ STATUS: Genuinely missing locally. Admin must upload a new copy via the admin panel.`);
      continue;
    }

    console.log(`📁 Found local copy: ${localPath}`);
    const stats = fs.statSync(localPath);
    console.log(`   File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

    const fileBuffer = fs.readFileSync(localPath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, paper.fileName);

    console.log(`🚀 Uploading to persistent Cloudinary storage...`);
    const uploadRes = await fetch(`${BACKEND_URL}/upload?type=pyq`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const uploadJson = await uploadRes.json();

    if (!uploadJson.success || !uploadJson.data?.fileUrl) {
      console.error(`❌ Upload failed:`, uploadJson.message || uploadJson);
      continue;
    }

    const newUrl = uploadJson.data.fileUrl;
    console.log(`✅ Uploaded to persistent storage:`);
    console.log(`   ${newUrl}`);

    // Test the URL with HEAD request
    console.log(`🧪 Verifying PDF URL returns HTTP 200 and application/pdf...`);
    const headRes = await fetch(newUrl, { method: 'HEAD' });
    const contentType = headRes.headers.get('content-type') || '';
    console.log(`   HTTP Status:   ${headRes.status}`);
    console.log(`   Content-Type:  ${contentType}`);

    if (headRes.status === 200 && contentType.includes('application/pdf')) {
      console.log(`✅ Verified: URL is accessible and delivers valid PDF.`);

      // Update the record in MongoDB via API
      console.log(`💾 Updating question paper record...`);
      const updateRes = await fetch(`${BACKEND_URL}/pyqs/${paper._id || paper.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileUrl: newUrl,
          fileName: paper.fileName,
          fileSize: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
        }),
      });
      const updateJson = await updateRes.json();
      if (updateJson.success) {
        console.log(`🎉 Successfully updated paper record with persistent Cloudinary URL!`);
      } else {
        console.error(`❌ Failed to update record:`, updateJson.message);
      }
    } else {
      console.error(`❌ Verification failed: status=${headRes.status}, type=${contentType}`);
    }
  }

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`Recovery process completed.`);
}

recoverPYQs().catch((err) => {
  console.error('Fatal error during recovery:', err);
  process.exit(1);
});

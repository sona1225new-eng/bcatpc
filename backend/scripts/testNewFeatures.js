const assert = require('assert');
const { cleanHtml } = require('../utils/sanitizeHtml');
const { hasPermission, getEffectivePermissions, MODULES, DEFAULT_PERMISSIONS_BY_ROLE } = require('../utils/permissions');
const Admin = require('../models/Admin');
const Page = require('../models/Page');
const Album = require('../models/Album');
const AuditLog = require('../models/AuditLog');

async function runTests() {
  console.log('🧪 Starting automated verification suite for new features...\n');

  // 1. RBAC & Permissions Logic Tests
  console.log('--- Test Suite 1: RBAC & Permissions Logic ---');
  const superadminMock = { role: 'superadmin', isActive: true };
  const adminMock = { role: 'admin', isActive: true, permissions: {} };
  const editorMock = { role: 'editor', isActive: true, permissions: {} };
  const viewerMock = { role: 'viewer', isActive: true, permissions: {} };
  const deactivatedMock = { role: 'superadmin', isActive: false };

  // Superadmin has full access to all modules and actions
  assert.strictEqual(hasPermission(superadminMock, 'users', 'delete'), true, 'Superadmin should have users:delete');
  assert.strictEqual(hasPermission(superadminMock, 'pages', 'publish'), true, 'Superadmin should have pages:publish');
  assert.strictEqual(hasPermission(superadminMock, 'faculty', 'create'), true, 'Superadmin should have faculty:create');

  // Deactivated user has NO access
  assert.strictEqual(hasPermission(deactivatedMock, 'dashboard', 'view'), false, 'Deactivated user must have 0 access');

  // Admin cannot manage users by default
  assert.strictEqual(hasPermission(adminMock, 'users', 'view'), false, 'Admin cannot view users by default');
  assert.strictEqual(hasPermission(adminMock, 'users', 'create'), false, 'Admin cannot create users by default');
  assert.strictEqual(hasPermission(adminMock, 'pages', 'create'), true, 'Admin can create pages');
  assert.strictEqual(hasPermission(adminMock, 'gallery', 'delete'), true, 'Admin can delete gallery items');

  // Editor can create/edit content, but cannot publish or delete by default
  assert.strictEqual(hasPermission(editorMock, 'pages', 'create'), true, 'Editor can create pages');
  assert.strictEqual(hasPermission(editorMock, 'pages', 'edit'), true, 'Editor can edit pages');
  assert.strictEqual(hasPermission(editorMock, 'pages', 'publish'), false, 'Editor cannot publish pages by default');
  assert.strictEqual(hasPermission(editorMock, 'pages', 'delete'), false, 'Editor cannot delete pages by default');
  assert.strictEqual(hasPermission(editorMock, 'users', 'view'), false, 'Editor cannot view users');

  // Viewer can only view
  assert.strictEqual(hasPermission(viewerMock, 'pages', 'view'), true, 'Viewer can view pages');
  assert.strictEqual(hasPermission(viewerMock, 'pages', 'create'), false, 'Viewer cannot create pages');
  assert.strictEqual(hasPermission(viewerMock, 'faculty', 'edit'), false, 'Viewer cannot edit faculty');

  // Custom permissions override
  const customAdminMock = {
    role: 'editor',
    isActive: true,
    permissions: {
      pages: ['view', 'create', 'edit', 'publish'], // Granted custom publish
    },
  };
  assert.strictEqual(hasPermission(customAdminMock, 'pages', 'publish'), true, 'Custom override granted pages:publish');
  assert.strictEqual(hasPermission(customAdminMock, 'pages', 'delete'), false, 'Custom override did not grant pages:delete');
  console.log('✅ RBAC & Permissions logic tests passed.');

  // 2. HTML Sanitization & XSS Prevention Tests
  console.log('\n--- Test Suite 2: HTML Sanitization & XSS Security ---');
  const dirtyMaliciousHtml = `
    <h1>Legitimate Title</h1>
    <p>Safe paragraph with <strong>bold</strong> and <em>italics</em>.</p>
    <script>alert('XSS Attack!');</script>
    <img src="http://example.com/pic.jpg" alt="Photo" onerror="alert('XSS via img onerror')">
    <a href="javascript:alert('XSS via javascript link')">Malicious Link</a>
    <a href="https://tpcollege.ac.in" target="_blank">Safe Link</a>
    <table><tr><th>Header</th></tr><tr><td>Data</td></tr></table>
  `;

  const clean = cleanHtml(dirtyMaliciousHtml);
  assert.ok(!clean.includes('<script>'), 'Script tag must be stripped');
  assert.ok(!clean.includes('onerror'), 'onerror attribute must be stripped');
  assert.ok(!clean.includes('javascript:'), 'javascript: URI scheme must be stripped');
  assert.ok(clean.includes('<h1>Legitimate Title</h1>'), 'Heading should be preserved');
  assert.ok(clean.includes('<strong>bold</strong>'), 'Formatting bold should be preserved');
  assert.ok(clean.includes('<table>'), 'Table should be preserved');
  assert.ok(clean.includes('rel="noopener noreferrer"'), 'Target _blank should get secure rel attributes');
  console.log('✅ HTML sanitization & XSS security tests passed.');

  // 3. Mongoose Schemas & Validation Tests
  console.log('\n--- Test Suite 3: Model Schema Validations ---');
  // Check Admin model fields
  const adminDoc = new Admin({
    name: 'Test Administrator',
    email: 'test@tpcollege.ac.in',
    password: 'Password123',
    role: 'editor',
  });
  assert.strictEqual(adminDoc.role, 'editor');
  assert.strictEqual(adminDoc.isActive, true);

  // Check Page model validation
  const pageDoc = new Page({
    title: 'Admissions 2026',
    slug: 'admissions-2026',
    content: '<p>Content</p>',
    status: 'draft',
  });
  assert.strictEqual(pageDoc.slug, 'admissions-2026');
  assert.strictEqual(pageDoc.status, 'draft');

  // Check Album model validation
  const albumDoc = new Album({
    title: 'Annual Sports Day 2026',
    slug: 'annual-sports-day-2026',
    category: 'Events',
    images: [
      { url: '/uploads/sports1.jpg', title: 'Sprint 100m', caption: 'Final heat', order: 0 },
      { url: '/uploads/sports2.jpg', title: 'Relay Race', caption: 'BCA Champions', order: 1 },
    ],
  });
  assert.strictEqual(albumDoc.images.length, 2);
  assert.strictEqual(albumDoc.images[0].url, '/uploads/sports1.jpg');
  console.log('✅ Model schema validations passed.');

  console.log('\n🎉 ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});

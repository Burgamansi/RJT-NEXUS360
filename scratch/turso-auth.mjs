/**
 * turso-auth.mjs — Turso auth + DB create, no turso CLI required.
 * If scratch/turso-platform-token.txt exists, skips browser auth.
 */
import http from 'node:http';
import crypto from 'node:crypto';
import { exec } from 'node:child_process';
import fs from 'node:fs';

const API_BASE = 'https://api.turso.tech';
const DB_NAME  = 'rjt-nexus360';
const LOCATION = 'ams';

// ── helpers ──────────────────────────────────────────────────────────────────
async function tursoGet(path, token) {
  const r = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!r.ok) throw new Error(`GET ${path} → ${r.status}: ${await r.text()}`);
  return r.json();
}

async function tursoPost(path, token, body) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`POST ${path} → ${r.status}: ${await r.text()}`);
  return r.json();
}

// ── browser oauth callback server ────────────────────────────────────────────
function browserAuth() {
  return new Promise((resolve, reject) => {
    const state  = crypto.randomBytes(16).toString('hex');
    const server = http.createServer((req, res) => {
      const u = new URL(req.url, 'http://localhost');
      const j = u.searchParams.get('jwt');
      const s = u.searchParams.get('state');
      if (!j || s !== state) { res.writeHead(400); res.end('bad'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h2>✓ Authenticated! Return to terminal.</h2>');
      server.close(() => resolve(j));
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const url = `${API_BASE}?port=${port}&redirect=true&type=cli&state=${state}`;
      console.log('\n🔐 Opening browser for Turso auth...');
      console.log('   URL:', url);
      exec(`start "" "${url}"`);
      console.log('\nWaiting for authentication...\n');
    });
  });
}

// ── main ─────────────────────────────────────────────────────────────────────
(async () => {
  // Load token from file or re-auth
  let jwt = process.argv[2];
  const tokenFile = 'scratch/turso-platform-token.txt';

  if (!jwt && fs.existsSync(tokenFile)) {
    jwt = fs.readFileSync(tokenFile, 'utf8').trim();
    console.log('✓ Loaded saved platform token');
  }

  if (!jwt) {
    jwt = await browserAuth();
    fs.writeFileSync(tokenFile, jwt);
    console.log('✓ Platform token saved');
  }

  // Validate token
  try {
    const v = await tursoGet('/v1/auth/validate', jwt);
    console.log('✓ Token valid, exp:', v.exp);
  } catch(e) {
    console.error('Token invalid:', e.message);
    // Delete cached token and retry
    if (fs.existsSync(tokenFile)) fs.unlinkSync(tokenFile);
    process.exit(1);
  }

  // Get org slug
  const resp = await tursoGet('/v2/organizations', jwt);
  console.log('Orgs response:', JSON.stringify(resp));
  const orgs = Array.isArray(resp) ? resp : (resp.organizations || [resp]);
  const org  = orgs.find(o => o.type === 'personal') || orgs[0];
  const orgSlug = org?.slug || org?.name;
  if (!orgSlug) throw new Error('Could not determine org slug from: ' + JSON.stringify(resp));
  console.log('✓ Org slug:', orgSlug);

  // Create database (or use existing)
  console.log(`\nCreating database "${DB_NAME}"...`);
  let dbHostname;
  try {
    const db = await tursoPost(`/v1/organizations/${orgSlug}/databases`, jwt, {
      name: DB_NAME, location: LOCATION, group: 'default'
    });
    dbHostname = db.database?.Hostname || db.Hostname;
    console.log('✓ Database created:', dbHostname);
  } catch(e) {
    if (e.message.includes('already exists') || e.message.includes('409')) {
      console.log('Database already exists — fetching...');
      const db = await tursoGet(`/v1/organizations/${orgSlug}/databases/${DB_NAME}`, jwt);
      dbHostname = db.database?.Hostname || db.Hostname;
      console.log('✓ Existing DB:', dbHostname);
    } else {
      throw e;
    }
  }

  // Create database token
  console.log('\nCreating database token...');
  const tokenResp = await tursoPost(
    `/v1/organizations/${orgSlug}/databases/${DB_NAME}/auth/tokens?expiration=never&authorization=full-access`,
    jwt, {}
  );
  const dbToken = tokenResp.jwt;
  console.log('✓ Database token created');

  // Output
  const dbUrl = `libsql://${dbHostname}`;
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TURSO_DATABASE_URL=' + dbUrl);
  console.log('TURSO_AUTH_TOKEN=' + dbToken);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  fs.writeFileSync('scratch/turso-creds.json', JSON.stringify({
    TURSO_DATABASE_URL: dbUrl,
    TURSO_AUTH_TOKEN: dbToken,
    orgSlug,
    dbName: DB_NAME
  }, null, 2));
  console.log('\n✓ Saved to scratch/turso-creds.json');
  process.exit(0);
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });

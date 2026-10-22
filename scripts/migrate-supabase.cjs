const fs = require('fs');
const path = require('path');
let Client;
try {
  Client = require('pg').Client;
} catch {
  Client = require('c:/Users/cs_mdatt001/Documents/antigravity/blissful-newton/node_modules/pg').Client;
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
});

const sqlPath = path.join(__dirname, '..', 'supabase', 'trustpulse-schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const rawConn = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_PRISMA_URL;
const conn = rawConn.split('?')[0];

const client = new Client({
  connectionString: conn,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL!');
    await client.query(sql);
    console.log('Successfully executed trustpulse-schema.sql!');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'trustpulse%'
      ORDER BY table_name;
    `);
    console.log('Verified Supabase Tables:', res.rows.map(r => r.table_name));
    await client.end();
  } catch (err) {
    console.error('Migration failed:', err.message);
    await client.end();
    process.exit(1);
  }
}

run();

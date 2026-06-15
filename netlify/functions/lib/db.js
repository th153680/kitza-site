const { neon } = require('@neondatabase/serverless');

let sql;

function getDb() {
  if (!sql) {
    const url = process.env.DATABASE_URL
      || process.env.NETLIFY_DATABASE_URL
      || '';
    if (!url) throw new Error('DATABASE_URL not set');
    sql = neon(url);
  }
  return sql;
}

async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS visits (
      id          SERIAL PRIMARY KEY,
      page        TEXT    NOT NULL,
      referrer    TEXT,
      user_agent  TEXT,
      ip          TEXT,
      screen_w    INTEGER,
      screen_h    INTEGER,
      language    TEXT,
      platform    TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_visits_page ON visits(page)`;
  return sql;
}

module.exports = { getDb, initDb };

const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const cookieSession = require('cookie-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password — change this on first deploy!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kitza2026';

// --- Database setup ---
const db = new Database(path.join(__dirname, 'analytics.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS visits (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    page        TEXT    NOT NULL,
    referrer    TEXT,
    user_agent  TEXT,
    ip          TEXT,
    screen_w    INTEGER,
    screen_h    INTEGER,
    language    TEXT,
    platform    TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at);
  CREATE INDEX IF NOT EXISTS idx_visits_page    ON visits(page);
`);

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
  name: 'kitza_session',
  keys: [process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')],
  maxAge: 24 * 60 * 60 * 1000, // 24h
}));

// Block direct access to admin files
app.use((req, res, next) => {
  if (req.path === '/admin.html' || req.path === '/admin-login.html') {
    return res.status(404).end('Not found');
  }
  next();
});

// Serve static files
app.use(express.static(__dirname, {
  index: 'index.html',
  extensions: ['html'],
}));

// --- Auth helpers ---
function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ error: 'Nao autorizado. Faca login em /admin' });
}

// --- Track endpoint (public) ---
const insertVisit = db.prepare(`
  INSERT INTO visits (page, referrer, user_agent, ip, screen_w, screen_h, language, platform)
  VALUES (@page, @referrer, @user_agent, @ip, @screen_w, @screen_h, @language, @platform)
`);

app.post('/api/track', (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const data = {
      page:       String(req.body.page || '/').slice(0, 500),
      referrer:   String(req.body.referrer || '').slice(0, 1000),
      user_agent: String(req.headers['user-agent'] || '').slice(0, 500),
      ip:         ip.split(',')[0].trim(),
      screen_w:   parseInt(req.body.sw, 10) || null,
      screen_h:   parseInt(req.body.sh, 10) || null,
      language:   String(req.body.lang || '').slice(0, 20),
      platform:   String(req.body.plat || '').slice(0, 50),
    };
    insertVisit.run(data);
    res.json({ ok: true });
  } catch (err) {
    console.error('Track error:', err.message);
    res.status(500).json({ ok: false });
  }
});

// --- Admin login ---
app.post('/admin/login', (req, res) => {
  const pw = req.body.password || '';
  if (pw === ADMIN_PASSWORD) {
    req.session.admin = true;
    res.redirect('/admin');
  } else {
    res.redirect('/admin?error=1');
  }
});

app.get('/admin/logout', (req, res) => {
  req.session = null;
  res.redirect('/admin');
});

// --- Admin dashboard (protected) ---
app.get('/admin', (req, res) => {
  if (!(req.session && req.session.admin)) {
    return res.sendFile(path.join(__dirname, 'admin-login.html'));
  }
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// --- Protected API routes ---
app.get('/api/visits', requireAuth, (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit  = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const offset = (page - 1) * limit;

  let where = '1=1';
  const params = {};

  if (req.query.from) {
    where += ' AND created_at >= @from';
    params.from = req.query.from;
  }
  if (req.query.to) {
    where += ' AND created_at <= @to';
    params.to = req.query.to;
  }
  if (req.query.pageFilter) {
    where += ' AND page LIKE @pageFilter';
    params.pageFilter = '%' + req.query.pageFilter + '%';
  }

  const total = db.prepare(`SELECT COUNT(*) as c FROM visits WHERE ${where}`).get(params).c;
  const rows  = db.prepare(`SELECT * FROM visits WHERE ${where} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit, offset });

  res.json({ total, page, limit, rows });
});

app.get('/api/stats', requireAuth, (req, res) => {
  const days = Math.min(365, Math.max(1, parseInt(req.query.days, 10) || 30));

  const totalVisits = db.prepare(`
    SELECT COUNT(*) as c FROM visits
    WHERE created_at >= datetime('now', '-' || @days || ' days')
  `).get({ days }).c;

  const uniqueIPs = db.prepare(`
    SELECT COUNT(DISTINCT ip) as c FROM visits
    WHERE created_at >= datetime('now', '-' || @days || ' days')
  `).get({ days }).c;

  const topPages = db.prepare(`
    SELECT page, COUNT(*) as views
    FROM visits
    WHERE created_at >= datetime('now', '-' || @days || ' days')
    GROUP BY page ORDER BY views DESC LIMIT 10
  `).all({ days });

  const visitsByDay = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as views
    FROM visits
    WHERE created_at >= datetime('now', '-' || @days || ' days')
    GROUP BY day ORDER BY day
  `).all({ days });

  const topReferrers = db.prepare(`
    SELECT referrer, COUNT(*) as views
    FROM visits
    WHERE created_at >= datetime('now', '-' || @days || ' days') AND referrer != ''
    GROUP BY referrer ORDER BY views DESC LIMIT 10
  `).all({ days });

  const browsers = db.prepare(`
    SELECT
      CASE
        WHEN user_agent LIKE '%Chrome%' AND user_agent NOT LIKE '%Edg%' THEN 'Chrome'
        WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
        WHEN user_agent LIKE '%Safari%' AND user_agent NOT LIKE '%Chrome%' THEN 'Safari'
        WHEN user_agent LIKE '%Edg%' THEN 'Edge'
        ELSE 'Outro'
      END as browser,
      COUNT(*) as views
    FROM visits
    WHERE created_at >= datetime('now', '-' || @days || ' days')
    GROUP BY browser ORDER BY views DESC
  `).all({ days });

  const devices = db.prepare(`
    SELECT
      CASE
        WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%Android%' THEN 'Mobile'
        WHEN user_agent LIKE '%Tablet%' OR user_agent LIKE '%iPad%' THEN 'Tablet'
        ELSE 'Desktop'
      END as device,
      COUNT(*) as views
    FROM visits
    WHERE created_at >= datetime('now', '-' || @days || ' days')
    GROUP BY device ORDER BY views DESC
  `).all({ days });

  const recentVisits = db.prepare(`
    SELECT * FROM visits ORDER BY created_at DESC LIMIT 20
  `).all();

  res.json({ totalVisits, uniqueIPs, topPages, visitsByDay, topReferrers, browsers, devices, recentVisits, days });
});

// --- Delete visit (admin) ---
app.delete('/api/visits/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM visits WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// --- Export CSV (admin) ---
app.get('/api/export', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM visits ORDER BY created_at DESC').all();
  const header = 'ID,Pagina,Referrer,User-Agent,IP,Tela,Idioma,Plataforma,Data\n';
  const csv = rows.map(r =>
    `${r.id},"${(r.page||'').replace(/"/g,'""')}","${(r.referrer||'').replace(/"/g,'""')}","${(r.user_agent||'').replace(/"/g,'""')}","${r.ip}","${r.screen_w||''}x${r.screen_h||''}","${r.language||''}","${r.platform||''}","${r.created_at}"`
  ).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=kitza-acessos.csv');
  res.send(header + csv);
});

app.listen(PORT, () => {
  console.log(`KITZA Analytics rodando em http://localhost:${PORT}`);
  console.log(`Painel admin: http://localhost:${PORT}/admin`);
  console.log(`Senha padrao: ${ADMIN_PASSWORD}`);
});

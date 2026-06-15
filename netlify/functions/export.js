const { initDb } = require('./lib/db');
const { isAuthenticated } = require('./lib/auth');

exports.handler = async (event) => {
  if (!isAuthenticated(event)) {
    return { statusCode: 401, body: 'Nao autorizado' };
  }

  try {
    const sql = await initDb();
    const rows = await sql`SELECT * FROM visits ORDER BY created_at DESC`;

    let csv = 'id,created_at,page,ip,user_agent,screen_w,screen_h,language,platform,referrer\n';
    for (const r of rows) {
      csv += [
        r.id,
        r.created_at,
        `"${String(r.page || '').replace(/"/g, '""')}"`,
        r.ip,
        `"${String(r.user_agent || '').replace(/"/g, '""')}"`,
        r.screen_w,
        r.screen_h,
        r.language,
        r.platform,
        `"${String(r.referrer || '').replace(/"/g, '""')}"`,
      ].join(',') + '\n';
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="kitza-acessos.csv"',
      },
      body: csv,
    };
  } catch (err) {
    console.error('Export error:', err.message);
    return { statusCode: 500, body: 'Erro interno' };
  }
};

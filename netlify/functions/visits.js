const { initDb } = require('./lib/db');
const { isAuthenticated } = require('./lib/auth');

exports.handler = async (event) => {
  if (!isAuthenticated(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Nao autorizado' }) };
  }

  try {
    const sql = await initDb();
    const qs = event.queryStringParameters || {};
    const page = Math.max(1, parseInt(qs.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(qs.limit, 10) || 50));
    const offset = (page - 1) * limit;

    // Build dynamic query with filters
    const conditions = [];
    const values = { limit, offset };

    if (qs.from) conditions.push(`created_at >= '${qs.from}'`);
    if (qs.to) conditions.push(`created_at <= '${qs.to}'`);
    if (qs.pageFilter) conditions.push(`page LIKE '%${qs.pageFilter.replace(/'/g, "''")}%'`);

    const where = conditions.length ? conditions.join(' AND ') : '1=1';

    const [{ c: total }] = await sql`
      SELECT COUNT(*) as c FROM visits WHERE created_at IS NOT NULL
    `;

    const rows = await sql`
      SELECT * FROM visits ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: Number(total), page, limit, rows }),
    };
  } catch (err) {
    console.error('Visits error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro interno' }) };
  }
};

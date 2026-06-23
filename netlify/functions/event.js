const { initDb } = require('./lib/db');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const sql = await initDb();
    const body = JSON.parse(event.body || '{}');
    const ip = (event.headers['x-forwarded-for'] || event.headers['client-ip'] || '').split(',')[0].trim();
    const user_agent = String(event.headers['user-agent'] || '').slice(0, 500);

    const ev = String(body.event || '').slice(0, 100);
    const product = String(body.product || '').slice(0, 300);
    const size = String(body.size || '').slice(0, 10);
    const price = parseFloat(body.price) || null;

    if (!ev) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'event required' }) };
    }

    await sql`
      INSERT INTO events (event, product, size, price, ip, user_agent)
      VALUES (${ev}, ${product}, ${size}, ${price}, ${ip}, ${user_agent})
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('Event error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};

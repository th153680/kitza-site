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

    const page = String(body.page || '/').slice(0, 500);
    const referrer = String(body.referrer || '').slice(0, 1000);
    const user_agent = String(event.headers['user-agent'] || '').slice(0, 500);
    const screen_w = parseInt(body.sw, 10) || null;
    const screen_h = parseInt(body.sh, 10) || null;
    const language = String(body.lang || '').slice(0, 20);
    const plat = String(body.plat || '').slice(0, 50);

    await sql`
      INSERT INTO visits (page, referrer, user_agent, ip, screen_w, screen_h, language, platform)
      VALUES (${page}, ${referrer}, ${user_agent}, ${ip}, ${screen_w}, ${screen_h}, ${language}, ${plat})
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('Track error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ ok: false }) };
  }
};

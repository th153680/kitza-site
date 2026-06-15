const { initDb } = require('./lib/db');
const { isAuthenticated } = require('./lib/auth');

exports.handler = async (event) => {
  if (!isAuthenticated(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Nao autorizado. Faca login em /admin' }) };
  }

  try {
    const sql = await initDb();
    const qs = event.queryStringParameters || {};
    const days = Math.min(365, Math.max(1, parseInt(qs.days, 10) || 30));

    const [{ c: totalVisits }] = await sql`
      SELECT COUNT(*) as c FROM visits WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
    `;

    const [{ c: uniqueIPs }] = await sql`
      SELECT COUNT(DISTINCT ip) as c FROM visits WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
    `;

    const topPages = await sql`
      SELECT page, COUNT(*) as views FROM visits
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY page ORDER BY views DESC LIMIT 10
    `;

    const visitsByDay = await sql`
      SELECT DATE(created_at)::text as day, COUNT(*) as views FROM visits
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY DATE(created_at) ORDER BY DATE(created_at)
    `;

    const topReferrers = await sql`
      SELECT referrer, COUNT(*) as views FROM visits
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days} AND referrer != ''
      GROUP BY referrer ORDER BY views DESC LIMIT 10
    `;

    const rawBrowsers = await sql`
      SELECT user_agent, COUNT(*) as views FROM visits
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY user_agent ORDER BY views DESC LIMIT 50
    `;

    const browserMap = {};
    for (const r of rawBrowsers) {
      const ua = r.user_agent || '';
      let name = 'Outro';
      if (ua.includes('Edg')) name = 'Edge';
      else if (ua.includes('Chrome')) name = 'Chrome';
      else if (ua.includes('Firefox')) name = 'Firefox';
      else if (ua.includes('Safari')) name = 'Safari';
      browserMap[name] = (browserMap[name] || 0) + Number(r.views);
    }
    const browsers = Object.entries(browserMap)
      .map(([browser, views]) => ({ browser, views }))
      .sort((a, b) => b.views - a.views);

    const rawDevices = await sql`
      SELECT user_agent, COUNT(*) as views FROM visits
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY user_agent ORDER BY views DESC LIMIT 50
    `;

    const deviceMap = {};
    for (const r of rawDevices) {
      const ua = r.user_agent || '';
      let name = 'Desktop';
      if (/Mobile|Android/i.test(ua)) name = 'Mobile';
      else if (/Tablet|iPad/i.test(ua)) name = 'Tablet';
      deviceMap[name] = (deviceMap[name] || 0) + Number(r.views);
    }
    const devices = Object.entries(deviceMap)
      .map(([device, views]) => ({ device, views }))
      .sort((a, b) => b.views - a.views);

    const recentVisits = await sql`
      SELECT * FROM visits
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      ORDER BY created_at DESC LIMIT 10
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalVisits: Number(totalVisits), uniqueIPs: Number(uniqueIPs), topPages, visitsByDay, topReferrers, browsers, devices, recentVisits }),
    };
  } catch (err) {
    console.error('Stats error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro interno' }) };
  }
};

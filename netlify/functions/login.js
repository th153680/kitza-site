const { ADMIN_PASSWORD, createToken, authCookie } = require('./lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const params = new URLSearchParams(event.body || '');
  const password = params.get('password') || '';

  if (password === ADMIN_PASSWORD) {
    const token = createToken();
    return {
      statusCode: 302,
      headers: {
        Location: '/admin',
        'Set-Cookie': authCookie(token),
        'Cache-Control': 'no-store',
      },
      body: '',
    };
  }

  return {
    statusCode: 302,
    headers: { Location: '/admin?error=1', 'Cache-Control': 'no-store' },
    body: '',
  };
};

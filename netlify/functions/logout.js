const { clearCookie } = require('./lib/auth');

exports.handler = async () => {
  return {
    statusCode: 302,
    headers: {
      Location: '/admin',
      'Set-Cookie': clearCookie(),
      'Cache-Control': 'no-store',
    },
    body: '',
  };
};

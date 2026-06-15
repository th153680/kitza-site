const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'kitza-default-secret-change-me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kitza2026';
const TOKEN_MAX_AGE = 24 * 60 * 60; // 24h in seconds

function createToken() {
  return jwt.sign({ admin: true }, SECRET, { expiresIn: TOKEN_MAX_AGE });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded.admin === true;
  } catch {
    return false;
  }
}

function getTokenFromCookies(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/kitza_token=([^;]+)/);
  return match ? match[1] : null;
}

function isAuthenticated(event) {
  const cookie = event.headers.cookie || '';
  const token = getTokenFromCookies(cookie);
  return token && verifyToken(token);
}

function authCookie(token) {
  return `kitza_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_MAX_AGE}`;
}

function clearCookie() {
  return 'kitza_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

module.exports = { ADMIN_PASSWORD, createToken, isAuthenticated, authCookie, clearCookie };

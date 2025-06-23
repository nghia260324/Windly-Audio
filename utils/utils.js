const jwt = require('jsonwebtoken');
const MEDIA_SECRET = process.env.THUMBNAIL_SECRET || 'your-secret-key';



function signMediaToken({ type, id }, ip, ua) {
  return jwt.sign({ type, id, ip, ua }, MEDIA_SECRET, { expiresIn: '6h' });
}

function verifyMediaToken(token, currentIp, currentUa) {
  try {
    const decoded = jwt.verify(token, MEDIA_SECRET);
    if (decoded.ip !== currentIp || decoded.ua !== currentUa) return null;

    const { type, id } = decoded;
    if (!type || !id) return null;

    return { type, id };
  } catch (err) {
    return null;
  }
}


function strictMediaAccess(req, res, next) {
  const referer = req.get('Referer') || '';
  const allowedRaw = process.env.ALLOWED_MEDIA_REFERRERS || '';
  const allowed = allowedRaw.split(',').map(r => r.trim());

  const isAllowed = allowed.some(origin => referer.startsWith(origin));

  if (!isAllowed) {
    return res.status(403).send('Forbidden: Invalid media source');
  }

  next();
}

module.exports = {
  signMediaToken,
  verifyMediaToken,
  strictMediaAccess,
};
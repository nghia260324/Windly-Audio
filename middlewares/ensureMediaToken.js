const { signMediaToken } = require('../utils/utils');

function ensureMediaToken(req, res, next) {
    if (!req.session.mediaTokens) req.session.mediaTokens = {};

    const ip = req.ip;
    const ua = req.get('User-Agent');

    const getToken = (type, id) => {
        const key = `${type}-${id}`;
        if (!req.session.mediaTokens[key]) {
            req.session.mediaTokens[key] = signMediaToken({ type, id }, ip, ua, '6h');
        }
        return req.session.mediaTokens[key];
    };

    req.getMediaToken = getToken;
    next();
}

module.exports = ensureMediaToken;

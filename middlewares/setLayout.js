function setAdminLayout(req, res, next) {
    res.locals.layout = 'admin';
    const cleanPath = req.originalUrl.split('?')[0];
    const match = cleanPath.match(/^\/admin\/([^\/]+)/);
    res.locals.active = match ? match[1] : 'dashboard';
    next();
}

function setAuthLayout(req, res, next) {
    res.locals.layout = 'auth';
    next();
}

function setUserLayout(req, res, next) {
    res.locals.layout = 'user';
    next();
}

module.exports = {
    setAdminLayout,
    setAuthLayout,
    setUserLayout
};

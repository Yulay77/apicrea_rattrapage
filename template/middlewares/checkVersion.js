const restrictedRoutes = {
  v1: {
    get: [(path) => path.startsWith('/game') || path.startsWith('/all'),],
    post: [(path) => path.startsWith('/game/') || path === '/create' || path.startsWith('/play/') || path.startsWith('/join/'),],
    delete: [(path) => path.startsWith('/game/end/') || path.startsWith('/game/delete') || path.startsWith('/game/') || path.startsWith('/')],
  },
  v2: {
    post: [(path) => path.startsWith('/users') || path.startsWith('/security/login') || path.startsWith('/register') || path.startsWith('/'),],
    get: [(path) => path.startsWith('/users/') || path.startsWith('/'),],
  }
};

module.exports = (req, res, next) => {
  const apiVersion = req.header('API-Version');
  const method = req.method.toLowerCase();

  if (restrictedRoutes[apiVersion] && restrictedRoutes[apiVersion][method]) {
    const routeMatchers = restrictedRoutes[apiVersion][method];
    let isAllowed = false;
    for (const matcher of routeMatchers) {
      if (typeof matcher === 'function' && matcher(req.path)) {
        isAllowed = true;
        break;
      } else if (matcher === req.path) {
        isAllowed = true;
        break;
      }
    }
    if (!isAllowed) {
      console.log(`Route ${req.path} is not included in restricted routes for ${apiVersion} and ${method}`);
      return res.status(403).send(`Route not allowed for API version ${apiVersion}`);
    }
  } else {
    console.log(`Method not allowed for API version ${apiVersion}`);
    return res.status(403).send(`Method not allowed for API version ${apiVersion}`);
  }
  next(); 
};
/*module.exports = async (req, res, next) => {
  const apiVersion = req.headers['api-version'];

  if (!apiVersion) {
    return res.status(400).send('API version is required');
  }

  const allowedVersions = ['v1', 'v2']; // liste des versions de l'API autorisées
  if (!allowedVersions.includes(apiVersion)) {
    return res.status(400).send(`Invalid API version: ${apiVersion}`);
  }

  req.apiVersion = apiVersion;
  next();
}*/

const restrictedRoutes = {
  v1: {
    get: [(path) => path.startsWith('/game') || path === '/',],
    post: [(path) => path.startsWith('/game/') || path === '/create' || path.startsWith('/play/') || path.startsWith('/join/'),],
    delete: [(path) => path.startsWith('/game/end/') || path === '/delete',], 
  },
  v2: {
    post: [(path) => path.startsWith('/users/') || path === 'security/login' || path === '/',],
    get: [(path) => path.startsWith('/users/') || path === '/',],
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
  next(); // Call the next middleware or route handler
};
  /*const restrictedRoutes = {
    v1: {
      get: ['/games', '/games/:id', '/'],
      post: ['/game/create', '/', '/create', 'games/play/:id', '/play/', '/games/join/:id', '/join',],
      delete: [ '/games/delete', '/delete', '/games/:id', '/games/end/:id','/end','/id'],
    },
    v2: {
      post: ['/users/register', 'security/login', '/'],
      get: ['/users', '/users/:id', '/']
    }
  };*/
/*
  // Vérifier si la version d'API est autorisée
  if (!allowedVersions.includes(apiVersion)) {
    return res.status(400).send(`Invalid API version: ${apiVersion}`);
  }

  // Vérifier si la route est autorisée pour la version d'API spécifiée et la méthode HTTP spécifiée
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

  req.apiVersion = apiVersion;
  next();
}*/
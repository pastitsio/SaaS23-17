const jwt = require('jsonwebtoken');

export const authenticate = (req, res, next) => {// middleware function to authenticate incoming requests
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // return a 401 Unauthorized error if the token is missing
    return res.status(401).send({ error: 'Authentication token is missing' });
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // // attach the decoded token to the request object for use in downstream handlers
    // req.user = decoded;

    // // check if the token is about to expire (e.g., within the next 2 minutes)
    // const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    // const minThreshold = 2 * 60; // 2 minutes

    // if (expiresIn < minThreshold) {
    //   // generate a new token and attach it to the response headers for future requests
    //   const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //   res.set('Authorization', `Bearer ${newToken}`);
    // }

    next(); // continue to the next middleware or route handler
  } catch (err) {
    // return a 401 Unauthorized error if the token is invalid or expired
    return res.status(401).send({ error: 'Authentication token is invalid or expired' });
  }
}

export const extractToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.substring(7); // Remove "Bearer " prefix
    req.token = token; // Attach the token to the request object
  }
  next();
}

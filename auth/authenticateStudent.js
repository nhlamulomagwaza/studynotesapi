const jwt = require('jsonwebtoken');

const authenticateStudent = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const parts = token.split(' ');
  const accessToken = parts[1];

  if (!accessToken) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = { studentId: decoded.studentId, name: decoded.name, surname: decoded.surname };
  
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token: ' + error.message });
  }
};

module.exports = authenticateStudent;
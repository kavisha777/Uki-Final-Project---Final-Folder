import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Add this import

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Attach full user info to request
      req.user = user;

      // Role-based access
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

export default authMiddleware;

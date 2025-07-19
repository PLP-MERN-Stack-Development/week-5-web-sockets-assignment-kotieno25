require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5005,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  nodeEnv: process.env.NODE_ENV || 'development',
}; 
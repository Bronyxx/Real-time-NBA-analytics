module.exports = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your_secret_here',
  JWT_INNER_ACCESS_SECRET: process.env.JWT_INNER_ACCESS_SECRET || 'inner_secret_here',
  serviceTimeout: process.env.serviceTimeout || 5000,
   REDIS_URL: process.env.REDIS_URL,
   ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',

   RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
     RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
}
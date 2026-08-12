module.exports = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your_secret_here',
  JWT_INNER_ACCESS_SECRET: process.env.JWT_INNER_ACCESS_SECRET || 'inner_secret_here',
  serviceTimeout: process.env.serviceTimeout || 5000,
  REDIS_URL: process.env.REDIS_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  SERVICE_TIMEOUT_MS: parseInt(process.env.SERVICE_TIMEOUT_MS || '60000', 10),
  CIRCUIT_BREAKER_THRESHOLD: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10),
  CIRCUIT_BREAKER_TIMEOUT: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT || '60000', 10),

  services: {
      USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3001',
      NOTIFICATION_SERVICE_URL:process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002'
  }
}
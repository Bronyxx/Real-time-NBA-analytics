module.exports = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your_secret_here',
  JWT_INNER_ACCESS_SECRET: process.env.JWT_INNER_ACCESS_SECRET || 'inner_secret_here',
}
  module.exports = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "wyeurornjs64850jfnlmsmls09251s2x37fbg0",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "826d2c0edb5ad8f8ac7668556c034ea228931a49576aefccc80d6f469cc4a34c4da82ca43a5c43de91ffdad2f4644c655e2eb3ccbb8bc2848cb64fe7ea2a1ab9",
  ACCESS_TOKEN_EXP: process.env.ACCESS_TOKEN_EXP || "15m",
  REFRESH_TOKEN_EXP: process.env.REFRESH_TOKEN_EXP || "7d",
  ACCESS_TOKEN_EXP_SEC: Number(process.env.ACCESS_TOKEN_EXP_SEC || 900),
  REFRESH_TOKEN_EXP_SEC: Number(process.env.REFRESH_TOKEN_EXP_SEC || 604800),
  REDIS_USER_TTL: Number(process.env.REDIS_USER_TTL || 86400),
  REDIS_GAMES_TTL: Number(process.env.REDIS_GAMES_TTL || 5300),
  BALLDONTLIE_API_KEY: process.env.BALLDONTLIE_API_KEY || "95bfaca0-2dd2-435c-b7e6-c1b2ce04e2b4",

  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  
JWT_INNER_ACCESS_SECRET: process.env.JWT_INNER_ACCESS_SECRET || 'inner_secret_here',

};
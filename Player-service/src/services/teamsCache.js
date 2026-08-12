// services/teamsCache.js — new file
const { redis } = require('../config/redis');
const  config  = require('../config');

const getTeamsMap = async () => {
  const cached = await redis.get('teams:abbreviation-to-id');
  if (cached) return JSON.parse(cached);

  const res = await fetch('https://api.balldontlie.io/v1/teams', {
    headers: { Authorization: config.BALLDONTLIE_API_KEY},
  });
  const { data: teams } = await res.json();

  const map = Object.fromEntries(teams.map((t) => [t.abbreviation, t.id]));
  await redis.set('teams:abbreviation-to-id', JSON.stringify(map), 'EX', 60 * 60 * 24);
  return map;
};

module.exports = { getTeamsMap };
const  config  = require("../config");
const {redis} = require("../config/redis");
const prisma = require('../config/prisma');
const logger = require('../config/logger');
const { fetchGamesFromApi, mapExternalGame } = require('./gamesApi');
const { getTeamsMap } = require('./teamsCache');
const {publishGameEvent} = require("../kafka/producer.js")

const getProfile=async (userId)=>{
   const userStoredInRedis= await redis.get(`user:${userId}`)
   if(userStoredInRedis) {
    return JSON.parse(userStoredInRedis)
   }
   const user= await prisma.user.findUnique({
    where:{
        id:userId
    }
   })
   if(!user){
    logger.info(`user with this id ${userId} does not exist`)
   }
   const {password:_password, ...safeUser}=user
   redis.set(`user:${userId}`, JSON.stringify(safeUser), 'EX', config.REDIS_USER_TTL)
   return safeUser;
}




 console.log("showGames called");
const showGames = async ({ date, team, cursor, limit }) => {
  const teamIds = team ? [(await getTeamsMap())[team.toUpperCase()]] : undefined;
  const cacheKey = `games:${date || 'all'}:${team || 'all'}:${cursor || 'first'}:${limit}`;

  const cached = await redis.get(cacheKey);
  //if (cached) return JSON.parse(cached);

  let raw;
  try {
    raw = await fetchGamesFromApi({ date, teamIds, cursor, perPage: limit });
  } catch (err) {
    logger.error(`balldontlie call failed: ${err.message}`);
    const stale = await redis.get(`${cacheKey}:stale`);
    if (stale) return JSON.parse(stale);
    throw err;
  }

  const games = raw.data.map(mapExternalGame);
  const result = { data: games, nextCursor: raw.meta.next_cursor ?? null };

  const ttl = games.some((g) => g.isLive) ? 10 : config.REDIS_GAMES_TTL;
  await redis.set(cacheKey, JSON.stringify(result), 'EX', ttl);
  await redis.set(`${cacheKey}:stale`, JSON.stringify(result), 'EX', 60 * 60);

  //test publish event
 
  console.log("Publishing event...");
    await publishGameEvent({
    eventType: "GAME_FETCHED",
    timestamp: new Date().toISOString(),
    data: games,
});

  return result;
};

module.exports={ getProfile,showGames }
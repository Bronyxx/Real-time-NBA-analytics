const { config } = require("../config");
const {redis} = require("../config/redis");
const prisma = require('../config/prisma');
const logger = require('../config/logger');


const getProfile=(userId)=>{
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


module.exports={ getProfile }
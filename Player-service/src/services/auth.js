const bcrypt=require('bcrypt')
const logger=require('../config/logger')
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const {redis} = require('../config/redis');
const config=require("../config")
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../utils/auth');
const { ConflictError, BadRequestError, ForbiddenError, UnauthorizedError } = require("../utils/error")


// // check existing user
// const existingUser=await prisma.user.findunique({
//     where: {
//         email:{email }
//     }
// })
// if(existingUser){
//     logger.info(`user with this email ${email} already exists`)
//      throw new Error("user already exists")
// }
// //if no user create new user
// hashedPassword=await bcrypt.hash(password,10)
// const user=await prisma.user.create({
//     data:{
//         email:email,
//         password:hashedPassword
//     }
// })
// return user
// // welcome email notification producer

const signup= async(email,name,password)=>{
    //check existing user
    const existingUser= await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(existingUser){
        logger.info(`user with this email already exists`)
        throw new ConflictError("User already exists", "USER_EXISTS");
       
    }
    //if no user create new user
    const saltRounds=10
    const hashedPassword= await bcrypt.hash(password, saltRounds)
    const user = await prisma.user.create({
          data: {
               name: name,
               email: email,
               password: hashedPassword,
          }
        
        })
        const accessToken=generateAccessToken(user.id)
        const refreshToken=generateRefreshToken(user.id)
         const {jti} = jwt.decode(refreshToken);
         await redis.set(`refresh:${user.id}`,jti, 'EX',config.REFRESH_TOKEN_EXP_SEC)
         const {password:_password,...safeUser}=user
         await redis.set(`user:${user.id}`,JSON.stringify(safeUser), 'EX',config.REDIS_USER_TTL)
         return {accessToken,refreshToken,user:safeUser}



}
const login =async(email,password)=>{
        const user= await prisma.user.findUnique({
          where: {
            email: email
          }
        })
        if(!user){
            logger.info(`user with this email${email} does not exist`)
            throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
            
        }
        
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            logger.info("Invalid email or password")
            throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
        }

        const accessToken=generateAccessToken(user.id)
        const refreshToken=generateRefreshToken(user.id)
         const {jti} = jwt.decode(refreshToken);
         await redis.set(`refresh:${user.id}`,jti, 'EX',config.REFRESH_TOKEN_EXP_SEC)
         const {password:_password,...safeUser}=user
        await  redis.set(`user:${user.id}`,JSON.stringify(safeUser),'EX',config.REDIS_USER_TTL)
         return {accessToken,refreshToken,user:safeUser}

}


 const rotateRefreshTokn=async(refreshToken)=>{
    const payload=verifyRefreshToken(refreshToken)
    const{id: userId,jti}=payload
    const storedJti= await redis.get(`refresh:${userId}`)
if(!storedJti){
    logger.info("Session epired, please login again")
     throw new ForbiddenError("Session Expired", "Login AGAIN")
    
}
if(storedJti!==jti){
    await redis.del(`refresh:${userId}`)
    logger.info("Refresh token reused ")
      throw new ForbiddenError("Refresh token reused", "LOGIN AGAIN")
    
}
const newAccessToken=generateAccessToken(userId)
const newRefreshToken=generateRefreshToken(userId)

const {jti: newJti}=jwt.decode(newRefreshToken)
await redis.set(`refresh:${userId}`,newJti, 'EX',config.REFRESH_TOKEN_EXP_SEC)
return {newAccessToken,newRefreshToken}

 }




module.exports = {signup,login,rotateRefreshTokn}
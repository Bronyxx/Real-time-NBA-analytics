const bcrypt=require('bcrypt')
const logger=require('../config/logger')
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../utils/auth');


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
        throw new Error("user already exists")
    }
    //if no user create new user
    const saltRounds=10
    const hashedPassword= await bcrypt.hash(password, saltRounds)
    const user = await prisma.user.create({
          data: {
               firstName: name,
               email: email,
               password: hashedPassword,
               emailVerified: true
          }
        
        })
        const acessToken=generateAccessToken(user.id)
        const refreshToken=generateRefreshToken(user.id)
         const {jti} = jwt.decode(refreshToken);
         await redis.set(`refresh ${user.id}`,jti, 'EX',config.JWT_REFRESHTOKEN_EXP)
         const {password:_password,...safeUser}=user
         redis.set(`user:${user.id}`,JSON.stringify(safeUser),EX,config.JWT_REFRESHTOKEN_EXP)
         return {acessToken,refreshToken,user:safeUser}



}
const login =async(email,password)=>{
        const user= await prisma.user.findUnique({
          where: {
            email: email
          }
        })
        if(!user){
            logger.info(`user with this email${email} does not exist`)
        }
        
        passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            logger.info("Invalid email or password")
        }

        const acessToken=generateAccessToken(user.id)
        const refreshToken=generateRefreshToken(user.id)
         const {jti} = jwt.decode(refreshToken);
         await redis.set(`refresh ${user.id}`,jti, 'EX',config.JWT_REFRESHTOKEN_EXP)
         const {password:_password,...safeUser}=user
         redis.set(`user:${user.id}`,JSON.stringify(safeUser),EX,config.JWT_REFRESHTOKEN_EXP)
         return {acessToken,refreshToken,user:safeUser}

}


 const rotateRefreshTokn=(refreshToken)=>{
    const payload=verifyRefrehToken(refreshToken)
    const{id: userId,jti}=payload
    const storedJti= await redis.get(`refresh${userId}`)
if(!storedJti){
    loggerinfo("Session epired, please login again")
}
if(storedJti!==jti){
    await redis.del(`refresh${userId}`)
    logger.info("invalid refresh token")
}
const newAccessToken=generateAccessToken(userId)
const newRefreshToken=generateRefreshToken(userId)

const {jti: newJti}=jwt.decode(newRefreshToken)
await redis.set(`refresh${userId}`,newJti,'EX',config.JWT.REFRESHTOKEN_EXP)
return {newAccessToken,newRefreshToken}

 }




module.exports = {login,rotateRefreshTokn}
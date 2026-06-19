const bcrypt=require('bcrypt')
const logger=require('../config/logger')
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../utils/auth');


// check existing user
const existingUser=await prisma.user.findunique({
    where: {
        email:{ equals: email }
    }
})
if(existingUser){
    logger.info(`user with this email ${email} already exists`)
}
//if no user create new user
hashedPassword=await bcrypt.hash(password,10)
const user=await prisma.user.create({
    data:{
        email:email,
        passowrd:hashedPassword
    }
})
return user
// welcome email notification producer

const login =async(email,password)=>{
        const user= await prisma.user.findUnique({
          where: {
            email: email
          }
        })
        if(!user){
            logger.info(`user with this email${email} does not exist`)
        }
        //google auth
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




module.exports = {login}
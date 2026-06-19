const crypto = require('crypto');
const { config } = require('../config');
const jwt = require('jsonwebtoken')


exports.hashtoken=(refreshToken)=>{
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
}

exports.generateacessToken=(userId)=>{
    const payload={ 
        id:userId
    }
return jwt.sign(payload,config.JWT_ACCESSTOKEN_SECRET,{expiresIn: config.JWT_ACCESSTOKEN_EXP})
}

exports.generateRefreshToken=(userId)=>{
    const payload={
        id:userId,
        jti:crypto.randomUUID()
    }
    return jwt.sign(payload,config.JWT_REFRESHTOKEN_SECRET,{expiresIn:config.JWT_REFRESHTOKEN_EXP})
}

exports.verifyAcessToken=(accessToken)=>{
    return jwt.verify(accessToken,config.JWT_ACCESSTOKEN_SECRET);
}

exports.verifyRefreshToken= (refreshToken)=>{
    return jwt.verify(refreshToken,config.JWT_REFRESHTOKEN_SECRET);
}
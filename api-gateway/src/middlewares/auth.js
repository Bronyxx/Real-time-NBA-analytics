const jwt = require('jsonwebtoken');
const  config  = require('../config');
const logger = require('../config/logger');

function authenticateToken(req, res, next) {
    try{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  const payload= jwt.verify(token, config.JWT_ACCESS_SECRET)
    if(!payload.id){

        logger.info("Invalid token id")
    }
    req.user={
        id: payload.id
    }
   const internalToken= jwt.sign({sub:payload.id}, config.JWT_INNER_ACCESS_SECRET, { expiresIn: '60s' });

req.headers['authorization']=`Bearer ${internalToken}`
    next();
}catch(err){
    logger.error(`error in authentication middleware:${err}`)
    res.status(401).json({error: "invalid token"})
}

  }


module.exports = { authenticateToken };
const express = require('express');
const{signup,login,rotateRefreshToken}=require('../services/auth.js')
const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/refresh', rotateRefreshToken)



module.exports=router;
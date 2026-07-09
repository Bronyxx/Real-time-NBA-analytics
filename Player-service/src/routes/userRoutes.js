const express = require('express');
const{getProfile}=require('../services/user.js')
const{userContext}= require('../middlewares/userContext.js')
const router = express.Router();

router.get('/getProfile',userContext,getProfile)
module.exports=router;
const express = require('express');
const{getProfile}=require('../services/user.js')
const{userContext}= require('../middlewares/userContext.js')
const {showGames}=require("../controllers/userControllers.js")
const router = express.Router();

router.get('/getProfile',userContext,getProfile)
router.get('/games',showGames)
module.exports=router;
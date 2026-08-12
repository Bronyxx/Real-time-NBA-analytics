const config = require('../config');
const authService= require('../services/auth.js')
const asyncHandler= require("../utils/asyncHandler.js")
const logger= require("../config/logger.js")


const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = (maxAge) => ({
     httpOnly: true,
     secure: isProd,
     sameSite: isProd ? 'strict' : 'lax',
     maxAge,
});

exports.signup= asyncHandler(async(req, res) =>{
    const {email,name,password}=req.body;
    if(!name || ! email || !password){
        return res.status(400).json({message: " All credentials are required"})
    }
    const{accessToken,refreshToken,user}=await authService.signup(email,name,password)
     res.cookie("accessToken", accessToken, cookieOptions(config.ACCESS_TOKEN_EXP_SEC * 1000))
     res.cookie("refreshToken", refreshToken, cookieOptions(config.REFRESH_TOKEN_EXP_SEC * 1000))
     .status(200).json({
          success: true,
          message: "Logged in successfully",
          user:user
     })
})

exports.login = asyncHandler(async(req, res) =>{
     const {email, password} = req.body;
     if(!email || !password){
          return res.status(400).json({message: " All credentials are required"})
     }
    
     const {accessToken, refreshToken, user} = await authService.login(email, password);
     res.cookie("accessToken", accessToken, cookieOptions(config.ACCESS_TOKEN_EXP_SEC * 1000))
     res.cookie("refreshToken", refreshToken, cookieOptions(config.REFRESH_TOKEN_EXP_SEC * 1000))
     .status(200).json({
          success: true,
          message: "Logged in successfully",
        user:user
     })
})

exports.rotateRefreshToken = asyncHandler(async(req, res) =>{
     const refreshToken = req.cookies.refreshToken;
     if(!refreshToken){
        logger.info("Refresh token is missing")
          return res.status(400).json({message: "Refresh token is missing"})
     }
    
     const {newAccessToken, newRefreshToken} = await authService.rotateRefreshToken(refreshToken);
     res.cookie("accessToken", newAccessToken, cookieOptions(config.ACCESS_TOKEN_EXP_SEC * 1000))
     res.cookie("refreshToken", newRefreshToken, cookieOptions(config.REFRESH_TOKEN_EXP_SEC * 1000))
     .status(200).json({
          success: true,
          message: "Access and Refresh token reissued"
     })
})


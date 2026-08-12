
const express= require("express")
require('dotenv').config();
const helmet = require("helmet")
const logger=require("./config/logger")
const bcrypt = require('bcrypt');
const authRoute= require("./routes/authRoutes")

const app= express()
app.use(helmet())

app.use(express.json())              
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});
app.use('/api',authRoute)
app.get("/",(req,res)=>{
    res.send("you are now in player service")
})

app.use((err, req, res, next) => {
  logger.error(err.message);
   const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal Server Error'
  });
});

app.listen(3001,()=>{
    logger.info("running on port 3001")
})
 
const express= require("express")
const helmet = require("helmet")
const logger=require("./middlewares/logger")

const app= express()
app.use(helmet())

app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});
app.get("/",(req,res)=>{
    res.send("you are now in player service")
})

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send('Internal Server Error');
});

app.listen(3001,()=>{
    logger.info("running on port 3001")
})
 
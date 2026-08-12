const express = require("express");
const helmet = require("helmet");

require("dotenv").config();
const {startConsumer}= require("./kafka/consumer.js")
const {getNotification}= require("./services/notificationService.js")
const app = express();
const notificationRouter=require("./routes/index.js");

app.use(helmet());
app.use(express.json());
app.use("/notifications",notificationRouter);


app.get("/notIndex", (req, res) => {
    res.send("Notification Service Running");
});


const PORT = process.env.PORT || 3002;

async function startServer() {
    

    app.listen(PORT, () => {
        console.log(`Notification Service running on ${PORT}`);
    });
    startConsumer().catch(console.error)
}

startServer().catch(console.error);



const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const  config  = require('./config');
const logger = require('./config/logger');
const morgan = require('morgan');
const cookieParser= require('cookie-parser');
const { corsMiddleware } = require('./middlewares/cors.js');
const {authenticateToken}= require('./middlewares/auth.js')
const routes=require('./routes');

const app = express();

app.use(helmet());

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


const stream = {
  write: (message) => logger.http(message.trim())
};

const morganMiddleware = morgan(
  config.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream }
);

app.get('/', (req, res) => {
  res.json({ message: "You are in the API gateway" });
});


app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' , timestamp: new Date().toISOString(),});
});

app.use('/api',routes);

app.listen(3000, () => {
  console.log('api-gateway running on port 3000');
 })

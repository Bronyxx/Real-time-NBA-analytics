


const express = require('express');
const cookieParser= require('cookie-parser');
const {authenticateToken}= require('./middlewares/auth')


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());



app.get('/health', authenticateToken, (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(3000, () => {
  console.log('api-gateway running on port 3000');
 })

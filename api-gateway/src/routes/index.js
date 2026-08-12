const express = require('express');
const { requireAuth } = require('../middlewares/auth.js');
const { createProxy, getCircuitBreakerStatus } = require('../services/proxy');
const { ipRateLimit, endpointRateLimit, combinedRateLimit } = require('../middlewares/ratelimit.js')
const  config  = require('../config')

const router = express.Router();

const userServiceProxy= createProxy('userService', config.services.USER_SERVICE_URL);
 router.post(
     '/users/auth/login',
     endpointRateLimit(100, 900000),// 100 requests per 15 minutes
     userServiceProxy
);

router.post(
     '/users/auth/signup',
     endpointRateLimit(100, 900000),// 100 requests per 15 minutes
     userServiceProxy
);


// notification service
const notificationServiceProxy=createProxy('notificationService',config.services.NOTIFICATION_SERVICE_URL);
router.get(
     '/not/notifications',
     endpointRateLimit(1000000, 900000),
     notificationServiceProxy
);

















module.exports = router;
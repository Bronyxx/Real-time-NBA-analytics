const axios = require('axios');
const  config  = require('../config');
const logger= require('../config/logger');
const { ServiceUnavailableError, GatewayTimeoutError } = require('../utils/error');



class CircuitBreaker {
     constructor(serviceName, threshold = config.CIRCUIT_BREAKER_THRESHOLD, timeout = config.CIRCUIT_BREAKER_TIMEOUT) {
          this.serviceName = serviceName;
          this.failureCount = 0;
          this.threshold = threshold;
          this.timeout = timeout;
          this.state = 'CLOSED'; 
          this.nextAttempt = Date.now();
     }

     async execute(request) {
          if (this.state === 'OPEN') {
               if (Date.now() < this.nextAttempt) {
                    throw new ServiceUnavailableError(
                         `Service ${this.serviceName} is temporarily unavailable. Circuit breaker is OPEN.`
                    );
               }
              
               this.state = 'HALF_OPEN';
               logger.info(`Circuit breaker HALF_OPEN for ${this.serviceName}`);
          }

          try {
               const response = await request();
               this.onSuccess();
               return response;
          } catch (err) {
               this.onFailure();
               throw err;
          }
     }

     onSuccess() {
          this.failureCount = 0;
          if (this.state === 'HALF_OPEN') {
               this.state = 'CLOSED';
               logger.info(`Circuit breaker CLOSED for ${this.serviceName}`);
          }
     }

     onFailure() {
          this.failureCount++;
          if (this.failureCount >= this.threshold) {
               this.state = 'OPEN';
               this.nextAttempt = Date.now() + this.timeout;
               logger.error(
                    `Circuit breaker OPEN for ${this.serviceName}. Next attempt at ${new Date(this.nextAttempt).toISOString()}`
               );
          }
     }

     getState() {
          return {
               service: this.serviceName,
               state: this.state,
               failureCount: this.failureCount,
               nextAttempt: this.state === 'OPEN' ? new Date(this.nextAttempt).toISOString() : null,
          };
     }
}

const circuitBreakers = {
     userService: new CircuitBreaker('user-service'),
     searchService: new CircuitBreaker('search-service'),
     adminService: new CircuitBreaker('admin-service'),
     notificationService: new CircuitBreaker('notification-service'),
     playerService: new CircuitBreaker('player-service'),
     GamesService: new CircuitBreaker('games-service'),
};

const forwardRequest= async(serviceUrl, path, method, data, headers,)=>{
  const url=`${serviceUrl}${path}`;
  logger.info(`Forwarding request to ${url}`);
  const configRequest={
    method,
    url,
    timeout: config.serviceTimeout,
    headers: {
        ...headers,
        'content-length':undefined,
        host: undefined,
         },
    validateStatus:()=>{
            return true;
        },
        maxRedirects:5,


  }

  if(method!=='get'&& method!=='DELETE' && data){
    configRequest.data=data;
  }
  if(method==='get'|| method==='DELETE' && data){
    configRequest.params=data;
  }
  logger.debug(`Forwarding ${method} ${url}`, {
          headers: configRequest.headers,
          hasData: !!data,
          timeout: config.SERVICE_TIMEOUT_MS,
     });

 try{
    const response=await axios(configRequest);

      logger.debug(`Response from ${url}:`, {
               status: response.status,
               statusText: response.statusText,
          });

    return {
               status: response.status,
               data: response.data,
               headers: response.headers,
          };

           } catch (err) {
          logger.error(`Error forwarding to ${serviceUrl}:`, {
               message: err.message,
               code: err.code,
               url: url,
               method: method,
               timeout: config.SERVICE_TIMEOUT_MS,
          });
        if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
               throw new GatewayTimeoutError(`Request to ${serviceUrl} timed out after ${config.SERVICE_TIMEOUT_MS}ms`);
          }
        if (err.code === 'ECONNREFUSED') {
             throw new ServiceUnavailableError(`Cannot connect to ${serviceUrl}. Service may be down.`);
          }

 if (err.response) {
               logger.error(`Service error from ${serviceUrl}:`, {
                    status: err.response.status,
                    data: err.response.data,
               });
            }

      return {
                    status: err.response.status,
                    data: err.response.data,
                    headers: err.response.headers,
          };
        }
 }

 function createProxy(serviceName, serviceUrl) {
     const circuitBreaker = circuitBreakers[serviceName];

     if (!circuitBreaker) {
          throw new Error(`No circuit breaker found for service: ${serviceName}`);
     }

     return async (req, res, next) => {
          try {
              
               logger.info(req.path);
              logger.info({
               baseUrl: req.baseUrl,
               path: req.path,
               originalUrl: req.originalUrl,
               url: req.url
          });
               
               const pathParts = req.path.split('/').filter(Boolean);
               logger.info(pathParts);
               
               const servicePath = '/' + pathParts.slice(1).join('/');
               logger.info(servicePath);

               const result = await forwardRequest(
                    serviceUrl,
                    servicePath + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''),
                    req.method,
                    req.body,
                    req.headers,
                    circuitBreaker
               );

               
               const excludeHeaders = ['connection', 'keep-alive', 'transfer-encoding', 'host'];
               Object.keys(result.headers).forEach((key) => {
                    if (!excludeHeaders.includes(key.toLowerCase())) {
                         res.setHeader(key, result.headers[key]);
                    }
               });

               
               res.status(result.status).json(result.data);
          } catch (err) {
               next(err);
          }
     };
}


 




module.exports={
  forwardRequest,
  createProxy,
  CircuitBreaker,
}
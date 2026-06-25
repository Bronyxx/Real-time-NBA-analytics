const axios = require('axios');
const  config  = require('../config');
const logger= require('../config/logger');

const forwardRequest= async(serviceUrl, path, method, data, headers,)=>{
  const url=`${serviceUrl}${path}`;
  logger.info(`Forwarding request to ${url}`);
  const configRequest={
    method,
    url,
    serviceTimeout=config.serviceTimeout,
    headers: {
        ...headers,
        'content-length':undefined,
        host: undefined,
        validateStatus=()=>{
            return true;
        },
        maxRedirects:5,



    }


  }

  if(method!=='get'&& method!=='DELETE' && data){
    configRequest.data=data;
  }
  if(method==='get'|| method==='DELETE' && data){
    configRequest.params=data;
  }
  logger.debug(`Forwarding ${method} ${url}`, {
          headers: requestConfig.headers,
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
               res.status(504).json({error:"Gateway service Timeout"})
          }
        if (err.code === 'ECONNREFUSED') {
              res.status(503).json({error:"service unavailable"})
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




module.exports={
  forwardRequest
}
'use strict';

module.exports = function(req, res, next){
  let response = req.body.Body.split(' ');
  if(response[0].toLowerCase() === 'subscribe'){
    req.subscribe = true;
  }
  console.log('reached subscribe check');
  return next();
};

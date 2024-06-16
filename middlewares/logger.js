const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${req.ip}`);
    next();
  };
  
  module.exports = logger;
  
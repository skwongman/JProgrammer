const Redis = require("ioredis");
require("dotenv").config();

const redisClient = new Redis({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

const cache = (req, res, next) => {

  const key = req.originalUrl;

  // Check if the current route should be cached or not
  if(key === "/api/drama" || key === "/api/popular" || key === "/api/timetable" || key.startsWith("/api/drama?")){
    redisClient.get(key, (err, data) => {
        if(err){
          console.error(err);
          return next();
        };

        if(data !== null){
          return res.send(JSON.parse(data));
        }
        else{
          res.sendResponse = res.send;

          res.send = (body) => {
            redisClient.set(key, JSON.stringify(body), "EX", 100);
            res.sendResponse(body);
          };

          next();
        };
    });
  }
  else{
      // If the current route should not be cached, just call next()
      next();
  };

};

module.exports = cache;
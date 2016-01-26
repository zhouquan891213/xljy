var redis = require("redis");
var config = require("../../config.js");

var redisClient = redis.createClient(config.redisConfig.port, config.redisConfig.host);

module.exports = redisClient;
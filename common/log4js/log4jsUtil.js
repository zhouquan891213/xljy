var log4js = require("log4js");
var config = require("../../config.js");

log4js.configure(config.log4jsConfig);

module.exports.getBusiLogger = function(){
    return log4js.getLogger("busi_log");
}

module.exports.getMysqlLogger = function(){
    return log4js.getLogger("mysql_log");
}

module.exports.connectLogger = function(logger, options){
    return log4js.connectLogger(logger, options);
}
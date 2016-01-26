var mysql = require("mysql");
var mysqlLogger = require("../log4js/log4jsUtil.js").getMysqlLogger();
var config = require("../../config.js");

var mysqlPool = mysql.createPool(config.mysqlConfig);

module.exports.query = function(sql, args, callback){
    mysqlLogger.debug("当前查询sql：" + sql + "，查询参数：" + JSON.stringify(args));
    mysqlPool.getConnection(function(err, conn){
        if(err){
            mysqlLogger.error("获取数据库连接失败：" +  err);
        }
        conn.query(sql, args, function(err, data){
            if(err){
                mysqlLogger.error("查询数据库失败：" + err);
            }else {
                mysqlLogger.debug("数据库查询成功：" + JSON.stringify(data));
            }
            callback.apply(null, [err, data]);
        });
    });
}

module.exports.getConnection = function(callback){
    mysqlPool.getConnection(function(err, conn){
        if(err){
            mysqlLogger.error("获取数据库连接失败：" +  err);
        }
        callback.apply(null, [err, conn]);
    });
}
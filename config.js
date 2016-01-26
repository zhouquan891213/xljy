//mysql配置数据
module.exports.mysqlConfig = {
    user : "zhouquan",
    password : "zhouquan",
    host : "120.25.102.158",
    port : "3306",
    database : "xltest",
    charset : "utf8"
};

//redis配置数据
module.exports.redisConfig = {
    host : "120.25.102.158",
    port : "6379"
};

//log4js配置数据
module.exports.log4jsConfig = {
    appenders : [
        {
            category : "console",
            type : "console"
        },
        {
            category : "busi_log",
            type : "datefile",
            filename : "logs/xlbusilog",
            pattern : "_yyyyMMdd.log",
            alwaysIncludePattern : true
        },
        {
            category : "mysql_log",
            type : "datefile",
            filename : "logs/xlmysqllog",
            pattern : "_yyyyMMdd.log",
            alwaysIncludePattern : true
        }
    ],
    replaceConsole : true,
    levels : {
        console : "ALL",
        busi_log : "ALL",
        mysql_log : "ALL",
        redis_log : "ALL"
    }
};

module.exports.filterUrls = ["/api/user/login", "/api/user/securityCode", "/api/user/register", "/api/user/resetPwd"];

module.exports.jwtTokenSecret = "xljy";
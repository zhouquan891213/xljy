var mysqlUtil = require("../../common/mysql/mysqlUtil.js");
var SmsLog = module.exports;

SmsLog.saveSmsLog = function(args, callback){
    mysqlUtil.query("insert into XL_SMS_LOG(billId,securityCode,sendDate,sendFlag,result) values (?,?,?,?,?)", args, callback);
}

SmsLog.findOne = function(billId, securityCode, callback){
    mysqlUtil.query("select * from XL_SMS_LOG where billId=? and securityCode=?", [billId, securityCode], function(err, data){
        if(err){
            return callback.apply(null, [err, data]);
        }
        if(!data || data.length == 0){
            return callback.apply(null, [err, null]);
        }
        if(data.length > 1){
            return callback.apply(null, [new Error("用户数据错误"), null]);
        }
        callback.apply(null, [err, data[0]]);
    });
}
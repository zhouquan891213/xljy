var User = module.exports;
var mysqlUtil = require("../../common/mysql/mysqlUtil.js");

User.findOne = function(userName, callback){
    mysqlUtil.query("select * from XL_USER where userName=?", [userName], function(err, data){
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

User.active = function(userName, password, callback){
    mysqlUtil.query("update XL_USER set state = 1,doneDate = now(),password=? where userName = ?", [password, userName], callback);
}

User.modifyPwd = function(userName, password, callback){
    mysqlUtil.query("update XL_USER set doneDate = now(),password=? where userName = ?", [password, userName], callback);
}



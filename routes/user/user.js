var busiLogger = require("../../common/log4js/log4jsUtil.js").getBusiLogger();
var User = require("../../modules/user/user.js");
var redisUtil = require("../../common/redis/redisUtil.js");
var jwt = require("jwt-simple");
var config = require("../../config.js");
var SmsSendUtil = require("../../common/util/SmsSendUtil.js");
var SmsLog = require("../../modules/user/smsLog.js");

module.exports.login = function(req, res, next){
    var userName = req.body.userName;
    if(!userName){
        return next(new Error("登录用户名不能为空"));
    }
    if(!req.body.source){
        return next(new Error("登录渠道信息不能为空"));
    }
    if(!req.body.channel){
        return next(new Error("登入入口信息不能为空"));
    }
    User.findOne(userName, function(err, user){
        if(err){
            return next(err);
        }
        if(!user){
            return next(new Error("用户信息不存在"));
        }
        if(user.password != req.body.password){
            return next(new Error("登录密码错误"));
        }
        if(user.state != 1){
            return next(new Error("用户未激活"));
        }
        Student.listByUserId(user.userId, function(err, students){
            if(err){
                return next(err);
            }
            if(!students || students.length <= 0){
                return next(new Error("该用户未关联宝贝"));
            }
            user.source = req.body.source;
            user.channel = req.body.channel;
            var date = new Date();
            date.setDate(date.getDate() + 7);
            if(students.length == 1){
                user.student = students[0];
            }
            user.token = jwt.encode({iss : user.userId, exp : date}, config.jwtTokenSecret);
            redisUtil.set(user.token, JSON.stringify(user), "EX", 7*24*60*60);
            var retStudents = new Array();
            for(var i = 0; i < students.length; i ++){
                retStudents.push({
                    studentId : students[i].studentId,
                    studentName : students[i].studentName,
                    schoolId : students[i].schoolId,
                    classId : students[i].classId
                });
            }
            res.json({
                code : "00",
                data : {
                    userId : user.userId,
                    billId : user.billId,
                    nickName : user.nickName,
                    custName : user.custName,
                    groupId : user.groupId,
                    pointNum : user.pointNum,
                    token : user.token,
                    students : retStudents
                }
            });
        });
    });
}

module.exports.resetPwd = function(req, res, next){
    var userName = req.body.userName;
    var password = req.body.password;
    var securityCode = req.body.securityCode;
    if(!userName){
        return next(new Error("手机号码不能为空"));
    }
    if(!securityCode){
        return next(new Error("短信验证码不能为空"));
    }
    if(!password){
        return next(new Error("密码不能为空"));
    }
    SmsLog.findOne(userName, securityCode, function(err, smsLog){
        if(err) {
            return next(err);
        }
        if(!smsLog){
            return next(new Error("短信验证码错误"));
        }
        var date = new Date();
        date.setMinutes(date.getMinutes() - 5);
        if(smsLog.sendDate < date){
            return next(new Error("短信验证码已过期"));
        }
        User.modifyPwd(userName, password, function(err, data){
            if(err){
                return next(err);
            }
            res.json({
                code : "00",
                msg : "重置密码成功"
            });
        });
    });
}

module.exports.modifyPwd = function(req, res, next){
    var userName = req.body.userName;
    var password = req.body.password;
    var oldPassword = req.body.oldPassword;
    if(!userName){
        return next(new Error("手机号码不能为空"));
    }
    if(!oldPassword){
        return next(new Error("原密码不能为空"));
    }
    if(!password){
        return next(new Error("新密码不能为空"));
    }
    User.findOne(userName, function(err, user){
        if(err) {
            return next(err);
        }
        if(!user){
            return next(new Error("用户信息不存在"));
        }
        if(user.state != 1){
            return next(new Error("用户未激活"));
        }
        if(user.password != oldPassword){
            return next(new Error("原密码错误"));
        }
        User.modifyPwd(userName, password, function(err, data){
            if(err){
                return next(err);
            }
            res.json({
                code : "00",
                msg : "密码修改成功"
            });
        });
    });
}

module.exports.getSecurityCode = function(req, res, next){
    var billId = req.params.billId;
    var securityCode = Math.round(Math.random() * 899999 + 100000);
    SmsSendUtil.sendSms(billId, securityCode, function(data){
        var error = data.error;
        SmsLog.saveSmsLog([billId, securityCode, new Date(), error, data.msg], function(err, info){
            if(err){
                return next(err);
            }
            if(error != 0){
                return next(new Error(data.msg));
            }
            res.json({
               code : "00",
               msg : "短信下发成功"
            });
        });
    });
}

module.exports.register = function(req, res, next){
    var userName = req.body.userName;
    var password = req.body.password;
    var securityCode = req.body.securityCode;
    if(!userName){
        return next(new Error("手机号码不能为空"));
    }
    if(!securityCode){
        return next(new Error("短信验证码不能为空"));
    }
    SmsLog.findOne(userName, securityCode, function(err, smsLog){
        if(err) {
            return next(err);
        }
        if(!smsLog){
            return next(new Error("短信验证码错误"));
        }
        var date = new Date();
        date.setMinutes(date.getMinutes() - 5);
        console.log(smsLog.sendData);
        if(smsLog.sendDate < date){
            return next(new Error("短信验证码已过期"));
        }
        User.active(userName, password, function(err, data){
            if(err){
                return next(err);
            }
            res.json({
                code : "00",
                msg : "注册成功"
            });
        });
    });
}
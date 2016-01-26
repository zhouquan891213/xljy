var Student = require("../../modules/user/student.js");
var redisUtil = require("../../common/redis/redisUtil.js");

module.exports.select = function(req, res, next){
    var userId = req.user.userId;
    var studentId = req.params.studentId;
    Student.findOne(userId, studentId, function(err, student){
        if(err){
            return next(err);
        }
        if(!student){
            return next(new Error("未查到关联的宝贝信息"));
        }
        var user = req.user;
        user.student = student;
        redisUtil.set(user.token, JSON.stringify(user));
        res.json({
            code : "00",
            msg : "宝贝选择成功"
        });
    });
}

module.exports.list = function(req, res, next){
    var userId = req.user.userId;
    Student.listByUserId(userId, function(err, students) {
        if (err) {
            return next(err);
        }
        if (!students || students.length <= 0) {
            return next(new Error("该用户未关联宝贝"));
        }
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
            students : retStudents
        });
    });
}

module.exports.leave = function(req, res, next){
    var userId = req.user.userId;
    var studentId = req.user.student.studentId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var reason = req.body.reason;
}
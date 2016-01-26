var mysqlUtil = require("../../common/mysql/mysqlUtil.js");

var StudentLeave = module.exports;

StudentLeave.save = function(args, callback){
    mysqlUtil.query("insert into XL_STUDENT_LEAVE");
};
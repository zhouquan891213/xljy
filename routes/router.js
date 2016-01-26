var express = require("express");
var user = require("./user/user.js");
var baby = require("./user/baby.js");
var menu = require("./base/menu.js");
var trends = require("./user/trends.js");

module.exports = function(req, res, next){
    var router = express.Router();

    //用户模块
    router.post("/api/user/login", user.login);
    router.get("/api/user/securityCode/:billId", user.getSecurityCode);
    router.post("/api/user/register", user.register);
    router.post("/api/user/resetPwd", user.resetPwd);
    router.post("/api/user/modifyPwd", user.modifyPwd);
    router.post("/api/trends/create", trends.create);

    //家长用户宝贝管理模块
    router.post("/api/baby/select/:studentId", baby.select);
    router.get("/api/baby/list", baby.list);
    router.post("/api/baby/leave", baby.leave);

    //基础配置管理
    router.get("/api/menu/list", menu.list);

    return router;
}

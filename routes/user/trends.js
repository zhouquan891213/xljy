var fs = require("fs");
var formidable = require("formidable");

module.exports.create = function(req, res, next){
    var userId = req.user.userId;
    var groupId = req.user.groupId;
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = 'public/photos/user' + userId + "/";	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        var content = fields.content;
        var pics = files.pics;
        console.log(JSON.stringify(files));
        res.json({
            code : "00",
            msg : "上传成功"
        });
    });

}
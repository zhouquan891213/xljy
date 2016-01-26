var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require("./routes/router.js");
var loginFilter = require("./filter/loginFilter.js");
var log4jsUtil = require("./common/log4js/log4jsUtil.js");
var busiLogger = log4jsUtil.getBusiLogger();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//使用log4js做日志输出
app.use(log4jsUtil.connectLogger(busiLogger, {level:'auto', format:':method :url'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录校验
app.use(loginFilter);

//路由控制
app.use(router());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('用户请求的资源不存在');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
  busiLogger.error(err);
  res.status(err.status || 200);
  res.json({
    code : 99,
    msg : err.message
  });
});



module.exports = app;

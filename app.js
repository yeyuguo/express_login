var express = require('express');
var mongoose = require('mongoose')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var config = require('./config')

var app = express();

// session 处理
app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine("html", require("ejs").__express);
// app.engine("html", require("jade").__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 处理报错小提示信息的
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = "";
    if (err) {
        // res.locals.message  在 html 中 <%- message %> 显示
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>';
    } else {
        // console.log({ res.locals.user })
        var aa = res['locals']['user']
        console.log({ aa })
    }

    next();
});


// (res.locals.user) => console.log({res.locals.user})

app.use('/', index);
app.use('/users', users); // login.html  register.html 页面


// 路由设置完后
global.dbHandel = require('./database/dbHandel');
// global.db = mongoose.connect("mongodb://127.0.0.1:27017/nodedb");
global.db = mongoose.connect(`mongodb://${config.mongoose.server}:${config.mongoose.port}/${config.mongoose.dbs[0]}`);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
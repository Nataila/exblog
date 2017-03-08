import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
var MongoStore = require('connect-mongo')(session);
import flash from 'connect-flash';
import routes from './routes/index';
import config from './config';
import users from './routes/users';
import admin from './routes/admin';
import post from './routes/post';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  name: 'sid',
  secret: config.cookieSecret,
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 10},
  store: new MongoStore({
    url: 'mongodb://127.0.0.1:27017/exblog'
  })
}));
app.use(flash());
app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/post', post);

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

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var lectureRouter = require('./routes/lecture');
var studentRouter = require('./routes/student');
var statisticsRouter = require('./routes/statistics');
var cors = require('cors');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  origin : 'http://localhost:3000',
  methods: 'GET, POST',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
  exposedHeaders: 'Authorization',
}))

// Adding router to the api
app.use('/', indexRouter);
app.use('/lecture', lectureRouter);
app.use('/student', studentRouter);
app.use('/statistics', statisticsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message
  })
});

module.exports = app;

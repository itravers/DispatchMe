var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var utils = require('./utils');
var app = utils.createApp();

var routes = require('./routes/index')(app, app.myPassport);
//var users = require('./routes/users');
//var schedules = require('./routes/schedules');
//var dashboard = require('./routes/dashboard');
//var configuration = require('./routes/configuration');





//app.use('/', routes);
//app.use('/users', users);
//app.use('/schedules', schedules);
//app.use('/dashboard', dashboard);
//app.use('/configuration', configuration);

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

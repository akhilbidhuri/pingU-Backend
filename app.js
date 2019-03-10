var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/regcomp', indexRouter);
app.use('/login', indexRouter);
app.use('/reguser', indexRouter);
app.use('/connect', indexRouter);
app.use('/users', usersRouter);
app.use(cors())
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
var server = app.listen(4000, () => console.log(`Example app listening on port 4000!`))
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.set('server', server);
module.exports = app;

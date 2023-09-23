var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var envRouter = require('./routes/environments');
var orgRouter = require('./routes/organisations');
var runTestRouter = require('./routes/run-test');
var requestsRouter = require('./routes/requests');
var sitesRouter = require('./routes/sites');


var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors());

const uri = "mongodb://127.0.0.1:27017/e2e-testing-projector"; // local db
// const uri = "mongodb://projectionrw:ABWturARBF98MPlcQ4Y=@db0.api.dev1.zailab.com:27017/admin"; // dev db

mongoose.connect(
  uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // Allow all origins for demonstration purposes; consider restricting origins in production
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/environments', envRouter);
app.use('/organisations', orgRouter);
app.use('/automate', runTestRouter);
app.use('/requests', requestsRouter);

// Used for testing
app.use('/sites', sitesRouter);

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

console.log('App | Loading...');

console.log('App | Loading third party dependencies');
console.log('App | Loading third party dependencies | http-errors ');
var createError = require('http-errors');
console.log('App | Loading third party dependencies | http-errors loaded ');
console.log('App | Loading third party dependencies | express ');

var express;

try {
  express = require('express');
} catch(e) {
  console.log(' ----------- an error occured loading express ', e);
}


console.log('App | Loading third party dependencies | express loaded ');
console.log('App | Loading third party dependencies | path ');
var path = require('path');
console.log('App | Loading third party dependencies | path loaded ');
console.log('App | Loading third party dependencies | cookie-parser ');
var cookieParser = require('cookie-parser');
console.log('App | Loading third party dependencies | cookie-parser loaded ');
console.log('App | Loading third party dependencies | morgan ');
var logger = require('morgan');
console.log('App | Loading third party dependencies | morgan loaded ');
console.log('App | Loading third party dependencies | cors ');
const cors = require('cors');
console.log('App | Loading third party dependencies | cors loaded ');
console.log('App | Loading third party dependencies | mongoose ');
var mongoose = require('mongoose');
console.log('App | Loading third party dependencies | mongoose loaded ');
console.log('App | Loading third party dependencies | passport ');
const passport = require('passport');
console.log('App | Loading third party dependencies | passport loaded ');

console.log('App | Loading dependencies');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var envRouter = require('./routes/environments');
var orgRouter = require('./routes/organisations');
var runTestRouter = require('./routes/run-test');
var requestsRouter = require('./routes/requests');
var sitesRouter = require('./routes/sites');

console.log('App | Dependencies... Loaded');

var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors());

// const uri = "mongodb://127.0.0.1:27017/e2e-testing-projector"; // local db
// const uri = "mongodb://192.168.1.6:27017/e2e-testing-projector"; // local db from docker container
const uri = "mongodb://projectionrw:ABWturARBF98MPlcQ4Y=@192.168.3.36:27017/admin"; // dev db

console.log('Connecting to mongo ...');
mongoose.connect(
  uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

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

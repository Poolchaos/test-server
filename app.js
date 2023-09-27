console.log('App | Loading...');

console.log('App | Loading third party dependencies...');

let dependencies = {
  createError: null,
  express: null,
  path: null,
  cookieParser: null,
  logger: null,
  cors: null,
  mongoose: null,
  passport: null
};
let routes = {};

function load(variable, dependency) {
  console.log('App | Loading third party dependency | ' + dependency);
  try {
    dependencies[variable] = require(dependency);
    console.log('App | Loading third party dependency | ' + dependency + ' loaded ');
  } catch(e) {
    console.log('ERROR | Failed to load ' + dependency + ' due to:', e);
  }
}

function loadRoute(route, dependency) {
  console.log('App | Loading file | ' + dependency);
  try {
    routes[route] = require(dependency);
    console.log('App | Loading file | ' + dependency + ' loaded ');
  } catch(e) {
    console.log('ERROR | Failed to load ' + dependency + ' due to:', e);
  }
}

load('createError', 'http-errors');
load('express', 'express');
load('path', 'path');
load('cookieParser', 'cookie-parser');
load('logger', 'morgan');
load('cors', 'cors');
load('mongoose', 'mongoose');
load('passport', 'passport');

console.log('App | Loading routes...');
loadRoute('indexRouter', './routes/index');
loadRoute('authRouter', './routes/auth');
loadRoute('envRouter', './routes/environments');
loadRoute('orgRouter', './routes/organisations');
loadRoute('runTestRouter', './routes/run-test');
loadRoute('requestsRouter', './routes/requests');
loadRoute('sitesRouter', './routes/sites');

console.log('App | Dependencies... Loaded');

var app = dependencies.express();
app.use(dependencies.express.urlencoded({ extended: false }));
app.use(dependencies.passport.initialize());
app.use(dependencies.cors());

// const uri = "mongodb://127.0.0.1:27017/e2e-testing-projector"; // local db
// const uri = "mongodb://192.168.1.6:27017/e2e-testing-projector"; // local db from docker container
const uri = "mongodb://projectionrw:ABWturARBF98MPlcQ4Y=@192.168.3.36:27017/admin"; // dev db

console.log('Connecting to mongo ...');
dependencies.mongoose.connect(
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
app.set('views', dependencies.path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(dependencies.logger('dev'));
app.use(dependencies.express.json());
app.use(dependencies.express.urlencoded({ extended: false }));
app.use(dependencies.cookieParser());
app.use(dependencies.express.static(dependencies.path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // Allow all origins for demonstration purposes; consider restricting origins in production
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', routes.indexRouter);
app.use('/auth', routes.authRouter);
app.use('/environments', routes.envRouter);
app.use('/organisations', routes.orgRouter);
app.use('/automate', routes.runTestRouter);
app.use('/requests', routes.requestsRouter);

// Used for testing
app.use('/sites', routes.sitesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(dependencies.createError(404));
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

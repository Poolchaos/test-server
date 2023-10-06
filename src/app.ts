import moment from 'moment';

// @ts-ignore
const getTimestamp = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
};
// @ts-ignore
const log = (value, data?) => {
  console.log('\u001B[34m' + getTimestamp() + '\u001B[0m - ' + value, (data || ''));
}

log('App | Loading...');

log('App | Loading third party dependencies...');


log('App | Loading third party dependency | express');
import express from 'express';
log('App | Loading third party dependency | express loaded ');
log('App | Loading third party dependency | cors');
import cors from 'cors';
log('App | Loading third party dependency | cors loaded ');
log('App | Loading third party dependency | http-errors');
import createError from 'http-errors';
log('App | Loading third party dependency | http-errors loaded ');
log('App | Loading third party dependency | path');
import path from 'path';
log('App | Loading third party dependency | path loaded ');
log('App | Loading third party dependency | cookie-parser');
import cookieParser from 'cookie-parser';
log('App | Loading third party dependency | cookie-parser loaded ');
log('App | Loading third party dependency | morgan');
import logger from 'morgan';
log('App | Loading third party dependency | morgan loaded ');
log('App | Loading third party dependency | mongoose');
import mongoose from 'mongoose';
log('App | Loading third party dependency | mongoose loaded ');
log('App | Loading third party dependency | passport');
import passport from 'passport';
log('App | Loading third party dependency | passport loaded ');
log('App | Loading third party dependency | compression');
import compression from 'compression';
log('App | Loading third party dependency | compression loaded ');

log('App | Loading routes...');

log('App | Loading resource | testSuitesRouter ');
import testSuitesRouter from './routes/test-suites';
log('App | Loading resource | testSuitesRouter loaded ');
log('App | Loading resource | subTestRouter ');
import subTestRouter from './routes/sub-tests';
log('App | Loading resource | subTestRouter loaded ');
log('App | Loading resource | authRouter ');
import authRouter from './routes/auth';
log('App | Loading resource | authRouter loaded ');
log('App | Loading resource | envRouter ');
import envRouter from './routes/environments';
log('App | Loading resource | envRouter loaded ');
log('App | Loading resource | orgRouter ');
import orgRouter from './routes/organisations';
log('App | Loading resource | orgRouter loaded ');
log('App | Loading resource | runTestRouter ');
import runTestRouter from './routes/run-test/run-test';
log('App | Loading resource | runTestRouter loaded ');
log('App | Loading resource | requestsRouter ');
import requestsRouter from './routes/requests';
log('App | Loading resource | requestsRouter loaded ');
log('App | Loading resource | resultsRouter ');
import resultsRouter from './routes/test-results';
log('App | Loading resource | resultsRouter loaded ');

log('App | Dependencies... Loaded');

var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors());
app.use(compression());


const environment = process.env.NODE_ENV;
const localMongo = "mongodb://127.0.0.1:27017/e2e-testing-projector"; // local db
const devMongo = "mongodb://projectionrw:ABWturARBF98MPlcQ4Y=@192.168.3.36:27017/admin"; // dev db (is prod for this app)

log('Connecting to mongo ...');
mongoose.connect(
  environment === 'development' ? localMongo : devMongo, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  log(`Connected to ${environment === 'development' ? 'local' : 'development'} MongoDB`);
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

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

app.use('/auth', authRouter);
app.use('/environments', envRouter);
app.use('/organisations', orgRouter);
app.use('/api-requests', requestsRouter);

app.use('/test-suites', testSuitesRouter);
app.use('/sub-tests', subTestRouter);
app.use('/automate', runTestRouter);
app.use('/results', resultsRouter);

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
  res.json({ error: err });
});

export default app;

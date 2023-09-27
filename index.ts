console.log('Server is starting...');

import moment from 'moment';

// @ts-ignore
const getTimestamp = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
};
// @ts-ignore
const log = (value, data?) => {
  console.log('\u001B[34m' + getTimestamp() + '\u001B[0m - ' + value, (data || ''));
}

// Add a global uncaught exception handler
process.on('uncaughtException', function (err) {
  log('Error: Uncaught exception:', err);
  // You may want to gracefully shut down the server or perform other cleanup here
});

// Add a global unhandled promise rejection handler
process.on('unhandledRejection', function (reason, promise) {
  log('Error: Unhandled promise rejection at:', { promise, reason });
  // You may want to handle or log the rejection reason here
});


log('Getting dependencies...');
import app from './src/app';
log('Getting dependencies... 1 ');
// import * as debug from 'debug';
log('Getting dependencies... 2 ');
// const debugInstance = debug('zai-test-service:server');
// log('Getting dependencies... 3 ');
import http from 'http';
log('Continuing after dependencies...');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
log('Server is listening...');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  console.info('Error:', error);
  if (error.syscall !== 'listen') {
    // Handle other types of errors here
    console.error('Error:', error);
  } else {
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    log('Application started | Listening on ' + bind);
}
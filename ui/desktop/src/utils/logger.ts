import log from 'electron-log';
import path from 'node:path';
import { app } from 'electron';

// Configure electron-log
// In development: ~/Library/Logs/daisy/main.log
// In production: ~/Library/Application Support/daisy/logs/main.log
log.transports.file.resolvePathFn = () => {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    return path.join(app.getPath('home'), 'Library/Logs/daisy/main.log');
  }
  return path.join(app.getPath('userData'), 'logs/main.log');
};

// Configure log level based on environment
log.transports.file.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

// Also log to console in development
log.transports.console.level = process.env.NODE_ENV === 'development' ? 'debug' : false;

export default log;

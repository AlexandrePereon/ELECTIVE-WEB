import winston from 'winston';

const logLevels = {
  levels: {
    connection: 0,
    trace: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    critical: 6,
  },
};

// Configuration des transports (sorties des logs)
const logger = winston.createLogger({
  levels: logLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/connection.log', level: 'connection' }),
  ],
});

export default logger;

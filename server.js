require('dotenv').config();
const express = require('express');
const logger = require('./src/log/logger');
const router = require('./src/routes/router');

const app = express();
const port = process.env.PORT;

app.use(router);

const server = app.listen(port, () => {
  logger.info('Server is running');
});

const shutdown = () => {
  logger.info('Clossing server');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

require('dotenv').config();
const express = require('express');
const logger = require('./src/log/logger');
const router = require('./src/routes/router');

const app = express();
const port = process.env.PORT;

app.use(router);

app.listen(port, () => {
  logger.info('Server is running');
});

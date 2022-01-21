const express = require('express');
const multer = require('multer');

const router = express.Router();
const logger = require('../log/logger');
const { uploadFile, downloadFile, getList, getStats } = require('../config/s3');

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, '');
  },
});

const upload = multer({ storage });

router.get('/open', (req, res, next) => {
  try {
    const [destination] = Object.keys(req.query);
    const [filename] = Object.values(req.query);
    const data = downloadFile(`${destination}${filename}`);
    data.on('error', (err) => res.status(err.statusCode).send(err)).pipe(res);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post('/create', upload.any(), async (req, res, next) => {
  try {
    const [file] = req.files;
    const [destination] = Object.keys(req.query);
    const result = await uploadFile(file, destination);
    res.send({ filePath: `${result.Key}` });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const [destination] = Object.keys(req.query);
    const list = await getList(destination);
    res.send(list);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const [destination] = Object.keys(req.query);
    const [filename] = Object.values(req.query);
    const fileStat = await getStats(`${destination}${filename}`);
    res.send({
      LastModified: fileStat.LastModified,
      Size: fileStat.ContentLength,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

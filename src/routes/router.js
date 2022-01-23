const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const router = express.Router();
const logger = require('../log/logger');
const { uploadFile, downloadFile, getList, getStats } = require('../config/s3');

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, '');
  },
});

const upload = multer({ storage });
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/open', (req, res, next) => {
  try {
    const filePath = req.query.path;
    const data = downloadFile(filePath);
    data.on('error', (err) => res.status(err.statusCode).send(err)).pipe(res);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post('/create', upload.any(), async (req, res, next) => {
  try {
    const [file] = req.files;
    const result = await uploadFile(file);
    res.send({ filePath: `${result.Key}` });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const filePath = req.query.path;
    const list = await getList(filePath);
    res.send(list);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const filePath = req.query.path;
    const fileStat = await getStats(filePath);
    res.send({
      LastModified: fileStat.LastModified,
      Size: fileStat.ContentLength,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

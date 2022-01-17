const express = require('express');
const multer = require('multer');

const router = express.Router();
const logger = require('../log/logger');
const { uploadFile, downloadFile } = require('../config/s3');

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, '');
  },
});

const upload = multer({ storage });

router.get('/download/:foldername/:filename', async (req, res, next) => {
  try {
    const { foldername, filename } = req.params;
    const file = await downloadFile(`${foldername}/${filename}`);
    res.send(file.Body);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post('/upload', upload.any(), async (req, res, next) => {
  try {
    const [file] = req.files;
    const result = await uploadFile(file);
    res.send({ filePath: `${result.Key}` });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

module.exports = router;

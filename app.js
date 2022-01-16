require("dotenv").config();
const express = require("express");
const multer = require("multer");

const port = process.env.PORT;
const app = express();

const { uploadFile , downloadFile } = require("./s3");

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
});

const upload = multer({storage}).single('file')

app.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  const file = await downloadFile(filename);
  res.send(file.Body)
  res.end()
});

app.post("/files", upload, async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  res.send({ filePath: `/files/${result.Key}` });
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});

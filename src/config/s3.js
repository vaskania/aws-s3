const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
const accessKey = process.env.AWS_AC;
const secretAccessKey = process.env.AWS_SC;

const s3 = new S3({
  accessKey,
  secretAccessKey,
  region,
});

// Uploads a file to s3

const uploadFile = async (file) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: `${file.fieldname}/${Date.now().toString()}-${file.originalname}`,
  };
  return s3.upload(uploadParams).promise();
};

// downloads a file from s3

const downloadFile = (filename) => {
  const downloadParams = {
    Key: filename,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).promise();
};

module.exports = { uploadFile, downloadFile };

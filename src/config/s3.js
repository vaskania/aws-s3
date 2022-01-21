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

const uploadFile = (file, fieldname) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: `${fieldname}${Date.now().toString()}-${file.originalname}`,
  };
  return s3.upload(uploadParams).promise();
};

// downloads a file from s3

const downloadFile = (filename) => {
  const params = {
    Key: filename,
    Bucket: bucketName,
  };

  return s3.getObject(params).createReadStream();
};

// list files or folders

const getList = async (prefix) => {
  const params = {
    Bucket: bucketName,
    Prefix: `${prefix}/`,
    Delimiter: '/',
  };

  const list = await s3.listObjectsV2(params).promise();
  const result = list.Contents.map((item) => {
    const file = item.Key.split(prefix);
    return file[1];
  });
  return result;
};

// Get file stat

const getStats = async (filename) => {
  const params = {
    Key: filename,
    Bucket: bucketName,
  };
  return s3.headObject(params).promise();
};

module.exports = {
  uploadFile,
  downloadFile,
  getList,
  getStats,
};

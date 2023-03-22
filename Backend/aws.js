const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: "AKIATLAOEO6AE3ZHGYX4",
  secretAccessKey: "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",
  region: "us-east-1",
  signatureVersion: 'v4'
});
const bucketName = "flynovate";

const userId = "6156272d93d079ba45eab3af";
const arrays = ["array1", "array2"];

async function get(id) {
  const bucketName = 'report-inspection';
  const folderName = `${id}/`;
  const objects = await s3.listObjects({ Bucket: bucketName, Prefix: folderName }).promise();
  if (!objects.Contents.length) {
    return;
  }
  const objectKeys = objects.Contents.map(({ Key }) => ({ Key }));
  await s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: objectKeys } }).promise();
  await s3.deleteObject({ Bucket: bucketName, Key: folderName }).promise();
}

get("6156272d93d079ba45eab3af").catch((error) => {
  console.log(error);
});

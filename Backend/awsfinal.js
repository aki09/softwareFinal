const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();

const s3 = new S3Client({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: "ap-south-1",
  signatureVersion: "v4",
});

exports.getPDF = async (id) => {
  const params = {
    Bucket: "report-inspection",
    Prefix: `${id}`,
  };
  const all_files = [];
  try {
    const data = await s3.send(new ListObjectsV2Command(params));
    if (!data || !data.Contents) {
      return null;
    }
    for (const item of data.Contents) {
      const reportName = item.Key.split("/").pop();
      const match = reportName.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
      let timestamp;
      if (match && match.length > 0) {
        timestamp = match[0].split("T")[0].split("-").reverse().join("-");
        // rest of your code
      } else {
        timestamp="";
      }
      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: "report-inspection",
          Key: item.Key,
          Expires: 360000,
        })
      );
      all_files.push({ name: timestamp, url: url });
    }
    all_files.shift();
    return all_files;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getImg = async (id) => {
  const params = {
    Bucket: "final-error-results",
    Prefix: `${id}`,
  };
  const all_files = [];
  try {
    const data = await s3.send(new ListObjectsV2Command(params));
    if (!data || !data.Contents) {
      return null;
    }
    for (const item of data.Contents) {
      const key = item.Key;
      if (/\.(jpg|jpeg|png|gif)$/i.test(key)) {
        const path = key.substring(0, key.lastIndexOf("/") + 1);
        const filename = key.substring(key.lastIndexOf("/") + 1);
        const new_name = path + filename;
        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: "final-error-results",
            Key: key,
            Expires: 3600,
          })
        );
        all_files.push({ name: new_name, url: url });
      }
    }
    return all_files;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.uploadPDF = async (pdfBuffer, id) => {
  const date = new Date();
  date.setHours(date.getHours() + 5); // Add 5 hours for IST
  date.setMinutes(date.getMinutes() + 30); // Add 30 minutes for IST

  const dateStr = date
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\.\d{3}/, ""); // Remove milliseconds
  const s3Key = `${id}/report-${dateStr}.pdf`;

  const params = {
    Bucket: "report-inspection",
    Key: s3Key,
    Body: pdfBuffer,
    ContentType: "application/pdf",
  };

  try {
    await s3.send(new PutObjectCommand(params));
  } catch (err) {
    console.error(`Failed to upload file to S3:`, err);
  }
};

exports.deleteiamges = async (id) => {
  const bucketName = "final-error-results";
  const folderName = `${id}/`;
  const objects = await s3.send(
    new ListObjectsV2Command({ Bucket: bucketName, Prefix: folderName })
  );
  if (!objects.Contents.length) {
    return;
  }
  const objectKeys = objects.Contents.map(({ Key }) => ({ Key }));
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: { Objects: objectKeys },
    })
  );
  await s3.send(
    new DeleteObjectCommand({ Bucket: bucketName, Key: folderName })
  );
};

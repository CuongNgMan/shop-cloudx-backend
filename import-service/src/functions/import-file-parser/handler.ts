import { S3Event } from "aws-lambda";
import { csvParser } from "@libs/csv-parser";
import { copyS3Object, deleteS3Object, getS3Object } from "@libs/s3";
import { formatJSONResponse } from "@libs/api-gateway";

const importFileParser = async (event: S3Event, _context, callback) => {
  try {
    const record = event.Records[0];
    console.log(`s3 record: ${JSON.stringify(record)}`);
    const bucketName = record.s3.bucket.name;
    const uploadedObjectKey = record.s3.object.key;
    const objectName = uploadedObjectKey.replace("uploaded/", "");
    const uploadedPath = `${bucketName}/${uploadedObjectKey}`;

    const uploadedS3Object = await getS3Object(bucketName, uploadedObjectKey);

    const products = await csvParser(uploadedS3Object.Body);

    const parsedObjectKey = `parsed/${objectName}`;

    await copyS3Object(bucketName, parsedObjectKey, uploadedPath);

    await deleteS3Object(bucketName, uploadedObjectKey);

    return formatJSONResponse({ message: "File processed", products });
  } catch (error) {
    console.log(`[importFileParser] ${JSON.stringify(error.stack)}`);
    callback(null, { statusCode: 500, body: JSON.stringify({ error: "Internal Error" }) });
  }
};

export const main = importFileParser;

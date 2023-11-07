import { S3Event } from "aws-lambda";
import { copyS3Object, deleteS3Object, getS3Object } from "@libs/s3";
import { formatJSONResponse } from "@libs/api-gateway";
import { csvParser } from "@libs/csv-parser";
import { sendToQueue } from "@libs/sqs";
import EnvConfig from "@libs/config";

const importFileParser = async (event: S3Event, _context, callback) => {
  console.log(`[importFileParser] ${JSON.stringify(event)}`);
  try {
    const record = event.Records[0];
    console.log(`s3 record: ${JSON.stringify(record)}`);
    const bucketName = record.s3.bucket.name;
    const uploadedObjectKey = record.s3.object.key;
    const objectName = uploadedObjectKey.replace("uploaded/", "");
    const uploadedPath = `${bucketName}/${uploadedObjectKey}`;

    const uploadedS3Object = await getS3Object(bucketName, uploadedObjectKey);

    const products = await csvParser(uploadedS3Object.Body, { onData: catalogItemsQueuePublisher });

    const parsedObjectKey = `parsed/${objectName}`;

    await copyS3Object(bucketName, parsedObjectKey, uploadedPath);

    await deleteS3Object(bucketName, uploadedObjectKey);

    return formatJSONResponse({ message: "File processed", products });
  } catch (error) {
    console.log(`[importFileParser] ${JSON.stringify(error.stack)}`);
    callback(null, { statusCode: 500, body: JSON.stringify({ error: "Internal Error" }) });
  }
};

const catalogItemsQueuePublisher = async (data: any) => {
  try {
    data.price = assignToNumber(data.price);
    data.count = assignToNumber(data.count);
    await sendToQueue(data, EnvConfig.catalogItemsQueueUrl);
  } catch (error) {
    console.log("Error while publishing to catalogItemsQueue", error.stack);
    // Handle fail message. Publish to DLQ
  }
};

const assignToNumber = (input: string) => {
  let value = Number(input);

  if (Number.isNaN(value)) {
    value = 0;
  }

  return value;
};

export const main = importFileParser;

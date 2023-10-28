import { formatJSONResponse } from "@libs/api-gateway";
import { StatusCodes } from "http-status-codes";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayEvent } from "aws-lambda";

const importProductFile = async (event, _context, callback) => {
  console.log(`[importProductFile] ${JSON.stringify(event)}`);

  const { name } = (<APIGatewayEvent>event).queryStringParameters;

  if (!name) {
    return formatJSONResponse(
      {
        data: null,
        message: "Missing required 'name' parameter",
      },
      StatusCodes.BAD_REQUEST
    );
  }

  try {
    const client = new S3Client();

    const command = new PutObjectCommand({
      Bucket: process.env.PRODUCT_FILE_BUCKET_NAME,
      Key: `uploaded/${name}`,
      ContentType: "text/csv",
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return formatJSONResponse({ signedUrl });
  } catch (error) {
    console.log(`[importProductFile] ${JSON.stringify(error.stack)}`);
    callback(null, { statusCode: 500, body: JSON.stringify({ error: "Internal Error" }) });
  }
};

export const main = importProductFile;

import { handlerPath } from "@libs/handler-resolver";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "get",
        path: "/import",
      },
    },
  ],
};

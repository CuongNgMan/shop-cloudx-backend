import { CopyObjectCommand, CopyObjectCommandInput, DeleteObjectCommand, DeleteObjectCommandInput, GetObjectCommand, GetObjectCommandInput, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client();

export const getS3Object = async (bucketName: string, key: string) => {
  const input: GetObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  };
  const getCommand = new GetObjectCommand(input);

  return s3Client.send(getCommand);
};

export const copyS3Object = async (bucketName: string, key: string, source: string) => {
  const input: CopyObjectCommandInput = {
    CopySource: source,
    Bucket: bucketName,
    Key: key,
  };
  const copyCommand = new CopyObjectCommand(input);

  return s3Client.send(copyCommand);
};

export const deleteS3Object = async (bucketName: string, key: string) => {
  const input: DeleteObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  };

  const deleteCommand = new DeleteObjectCommand(input);

  return s3Client.send(deleteCommand);
};

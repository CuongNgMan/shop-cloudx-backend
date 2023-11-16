import type { AWS } from "@serverless/typescript";

import importProductFile from "@functions/import-product-file";
import importFileParser from "@functions/import-file-parser";

// "Fn::Sub": "https://sqs.${AWS::Region}.amazonaws.com/${AWS::AccountId}/${SQSCataLogItems}",
// "Fn::Sub": "arn:aws:sqs:${AWS::Region}:${AWS::AccountId}:${SQSCataLogItems}",

const serverlessConfiguration: AWS = {
  org: "cngman",
  app: "shop-cloudx-epam",
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      CATALOG_ITEMS_QUEUE_URL: {
        "Fn::ImportValue": {
          "Fn::Sub": "shop-cloudx-backend-${opt:stage}-QueueURL",
        },
      },
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    httpApi: {
      cors: {
        allowedOrigins: ["${self:custom.cloudfront.origin}"],
        allowedHeaders: ["Content-Type", "Authorization"],
        allowedMethods: ["OPTIONS", "GET", "PUT"],
        maxAge: 86400,
        allowCredentials: true,
      },
      authorizers: {
        tokenAuthorizer: {
          type: "request",
          functionArn: "arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:authorization-service-dev-basicAuthorization",
          resultTtlInSeconds: 0,
          identitySource: "$request.header.Authorization",
          name: "tokenAuthorizer",
        },
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "s3:*",
            Resource: "arn:aws:s3:::${self:custom.s3product.bucketName}/*",
          },
          {
            Effect: "Allow",
            Action: "sqs:*",
            Resource: {
              "Fn::ImportValue": {
                "Fn::Sub": "shop-cloudx-backend-${opt:stage}-QueueARN",
              },
            },
          },
        ],
      },
    },
  },
  functions: { importProductFile, importFileParser },
  package: { individually: true },
  custom: {
    cloudfront: {
      origin: "https://d7c7mt7bdlgm7.cloudfront.net",
    },
    s3product: {
      bucketName: "cloudx-epam-product-upload",
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      UploadProductS3Bucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.s3product.bucketName}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ["${self:custom.cloudfront.origin}"],
                AllowedMethods: ["PUT", "GET"],
                AllowedHeaders: ["*"],
                MaxAge: 3600,
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;

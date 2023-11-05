import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/get-products-list";
import getProductById from "@functions/get-product-by-id";
import createProduct from "@functions/create-product";
import catalogBatchProcess from "@functions/catalog-batch-process";

const serverlessConfiguration: AWS = {
  org: "cngman",
  app: "shop-cloudx-epam",
  service: "shop-cloudx-backend",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
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
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCT_TABLE: "products",
      STOCK_TABLE: "stocks",
      SNS_ARN: {
        Ref: "SNSCreateProductTopic",
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:*"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["sqs:*"],
            Resource: {
              "Fn::GetAtt": ["SQSCataLogItems", "Arn"],
            },
          },
          {
            Effect: "Allow",
            Action: ["sns:*"],
            Resource: {
              Ref: "SNSCreateProductTopic",
            },
          },
        ],
      },
    },
  },
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
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
    secrets: "file(secrets.json)",
  },
  resources: {
    Resources: {
      SQSCataLogItems: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      SNSCreateProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      SNSCreateProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          Endpoint: "cuong.ngman@gmail.com",
          TopicArn: {
            Ref: "SNSCreateProductTopic",
          },
          FilterPolicyScope: "MessageAttributes",
          FilterPolicy: {
            product_count: [{ numeric: [">", 200] }],
          },
        },
      },
      SNSCreateProductSubscriptionLowPrice: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          Endpoint: "cmarty.biz@gmail.com",
          TopicArn: {
            Ref: "SNSCreateProductTopic",
          },
          FilterPolicyScope: "MessageAttributes",
          FilterPolicy: {
            product_count: [{ numeric: ["<", 101] }],
          },
        },
      },
    },
    Outputs: {
      SQSCataLogItemsQueueURL: {
        Description: "Queue URL",
        Value: { Ref: "SQSCataLogItems" },
        Export: {
          Name: { "Fn::Sub": "${AWS::StackName}-QueueURL" },
        },
      },
      SQSCataLogItemsARN: {
        Description: "Queue ARN",
        Value: { "Fn::GetAtt": ["SQSCataLogItems", "Arn"] },
        Export: {
          Name: { "Fn::Sub": "${AWS::StackName}-QueueARN" },
        },
      },
      SQSCatalogItemsQueueName: {
        Description: "Queue Name",
        Value: { "Fn::GetAtt": ["SQSCataLogItems", "QueueName"] },
      },
    },
  },
};

module.exports = serverlessConfiguration;

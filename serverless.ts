import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-products-list';
import getProductById from '@functions/get-product-by-id';

const serverlessConfiguration: AWS = {
  org: 'cngman',
  app: 'shop-cloudx-epam',
  service: 'shop-cloudx-backend',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: { getProductsList, getProductById },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    secrets: '${file(secrets.json)}',
  },
};

module.exports = serverlessConfiguration;

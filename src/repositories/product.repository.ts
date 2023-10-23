import { GetCommandInput, PutCommandInput, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { nanoid } from 'nanoid';

import type { ProductType } from '@schemas';
import DynamoDBClient, { STATUS } from '@libs/dynamo-db-connect-client';

export class ProductRepository {
  private tableName: string = process.env.PRODUCT_TABLE ?? '';

  constructor() {}

  async getById(productId: string): Promise<ProductType> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: {
        id: productId,
      },
    };

    const response = await DynamoDBClient.get(params);

    if (response.status === STATUS.ERROR) return null;

    return response.body as ProductType;
  }

  async create(input: Partial<ProductType>): Promise<ProductType> {
    const product = { ...input, id: nanoid() } as ProductType;

    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: product,
    };

    const response = await DynamoDBClient.put(params);

    if (response.status === STATUS.ERROR) return null;

    return product;
  }

  async list(): Promise<ProductType[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
    };

    const response = await DynamoDBClient.scan<ProductType>(params);

    if (response.status === STATUS.ERROR) return null;

    return response.body as ProductType[];
  }
}

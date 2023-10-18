import { GetCommandInput, PutCommandInput } from '@aws-sdk/lib-dynamodb';

import type { StockType } from '@schemas';
import DynamoDBClient, { STATUS } from '@libs/dynamo-db-connect-client';

export class StockRepository {
  private tableName: string = process.env.STOCK_TABLE ?? '';

  constructor() {}

  async getById(productId: string): Promise<StockType> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: {
        product_id: productId,
      },
    };

    const response = await DynamoDBClient.get(params);

    if (response.status === STATUS.ERROR) {
      return null;
    }

    const stock = response.body as StockType;

    return stock;
  }

  async create({ product_id, count }: Partial<StockType>): Promise<StockType | null> {
    const stock: StockType = { product_id, count } as StockType;

    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: stock,
    };

    const response = await DynamoDBClient.put(params);

    if (response.status === STATUS.ERROR) {
      return null;
    }

    return stock;
  }
}

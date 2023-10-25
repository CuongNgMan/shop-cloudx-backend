import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDB({});

const dynamoDbClient = DynamoDBDocument.from(client);

export enum STATUS {
  SUCCESS,
  ERROR,
}

interface IResponse<T> {
  body: T | T[];
  status: STATUS;
}

export class DynamoDBClient {
  toJSONResponse<T>(data: any, status: STATUS = STATUS.SUCCESS): IResponse<T> {
    return {
      status,
      body: data,
    };
  }

  async get<T>(filters): Promise<IResponse<T>> {
    try {
      const response = await dynamoDbClient.get(filters);
      return this.toJSONResponse<T>(response.Item);
    } catch (error) {
      return this.toJSONResponse(error, STATUS.ERROR);
    }
  }

  async scan<T>(params): Promise<IResponse<T>> {
    try {
      const response = await dynamoDbClient.scan(params);
      return this.toJSONResponse<T>(response.Items);
    } catch (error) {
      return this.toJSONResponse(error, STATUS.ERROR);
    }
  }

  async put(params): Promise<IResponse<string>> {
    try {
      await dynamoDbClient.put(params);
      return this.toJSONResponse<string>('Created');
    } catch (error) {
      return this.toJSONResponse(error, STATUS.ERROR);
    }
  }

  async query<T>(params): Promise<IResponse<T[]>> {
    try {
      const response = await dynamoDbClient.query(params);
      return this.toJSONResponse<T[]>(response.Items);
    } catch (error) {
      return this.toJSONResponse(error, STATUS.ERROR);
    }
  }
}

export default new DynamoDBClient();

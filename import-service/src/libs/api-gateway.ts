import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";
import { StatusCodes } from "http-status-codes";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;
export type EventAPIGatewayProxyEvent = Handler<APIGatewayProxyEvent, APIGatewayProxyResult>;

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS, DELETE",
};

export const formatJSONResponse = (response: Record<string, unknown>, statusCode = StatusCodes.OK) => {
  return {
    headers: defaultHeaders,
    statusCode,
    body: JSON.stringify(response),
  };
};

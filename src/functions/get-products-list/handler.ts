import { EventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { PRODUCTS } from '@mocks';

const getProductList: EventAPIGatewayProxyEvent = async (event) => {
  console.log(event);
  return formatJSONResponse({
    data: PRODUCTS,
    counts: PRODUCTS.length,
  });
};

export const main = getProductList;

import { EventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { PRODUCTS } from '@mocks';

const getProductList: EventAPIGatewayProxyEvent = async (_event, _context, _callback) => {
  return formatJSONResponse({
    data: PRODUCTS,
    counts: PRODUCTS.length,
  });
};

export const main = getProductList;

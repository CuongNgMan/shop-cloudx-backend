import { EventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { PRODUCTS } from '@mocks';

const getProductById: EventAPIGatewayProxyEvent = async (event) => {
  const { productId } = event.pathParameters;
  const product = PRODUCTS.find((p) => p.id === productId);
  const statusCode = product ? 200 : 404;

  return formatJSONResponse(
    {
      data: product,
      message: product ? 'Found' : 'Product not found',
    },
    statusCode
  );
};

export const main = getProductById;

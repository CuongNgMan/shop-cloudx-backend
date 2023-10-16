import { formatJSONResponse } from '@libs/api-gateway';
import { PRODUCTS } from '@mocks';

const getProductById = async (event, _context, callback) => {
  const { productId } = event.pathParameters;
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    callback(null, { statusCode: 404, body: JSON.stringify({ error: 'Not Found' }) });
  }

  return formatJSONResponse({
    data: product,
    message: product ? 'Found' : 'Product not found',
  });
};

export const main = getProductById;

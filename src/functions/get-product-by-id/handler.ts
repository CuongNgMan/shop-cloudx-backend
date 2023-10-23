import { formatJSONResponse } from '@libs/api-gateway';
import { ProductRepository, StockRepository } from '@repository';

const getProductById = async (event, _context, callback) => {
  console.log(`[getProductById] receive params: ${JSON.stringify(event.pathParameters)}`);

  const { productId } = event.pathParameters;

  const productRepository = new ProductRepository();

  const stockRepository = new StockRepository();

  const product = await productRepository.getById(productId);

  if (!product) {
    callback(null, { statusCode: 404, body: JSON.stringify({ error: 'Not Found' }) });
    return;
  }

  const stock = await stockRepository.getById(productId);

  if (!stock) {
    callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Error getting stock' }) });
    return;
  }

  return formatJSONResponse({
    data: { ...product, count: stock.count },
    message: product ? 'Found' : 'Product not found',
  });
};

export const main = getProductById;

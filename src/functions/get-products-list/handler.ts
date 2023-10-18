import { EventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { ProductRepository, StockRepository } from '@repository';

const getProductList: EventAPIGatewayProxyEvent = async (_event, _context, callback) => {
  console.log('[getProductList]')
  const productRepository = new ProductRepository();
  const stockRepository = new StockRepository();

  const products = await productRepository.list();

  const stockPromises = products.map((product) => stockRepository.getById(product.id));

  try {
    const stocks = await Promise.all(stockPromises);
    const response = products.map((product, index) => ({ ...product, count: stocks[index].count }));
    return formatJSONResponse({ items: response, count: products.length });
  } catch (error) {
    callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Error' }) });
  }
};

export const main = getProductList;

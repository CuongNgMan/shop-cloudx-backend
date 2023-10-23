import { formatJSONResponse } from '@libs/api-gateway';
import { ProductRepository, StockRepository } from '@repository';
import { StatusCodes } from 'http-status-codes';

const createProduct = async (event, _context, _callback) => {
  console.log(`[createProduct] request data: ${JSON.stringify(event.body)}`);
  const { title, description, price, count = 0 } = JSON.parse(event.body);

  const productRepository = new ProductRepository();
  const stockRepository = new StockRepository();

  const product = await productRepository.create({ title, description, price });

  if (!product) {
    return formatJSONResponse(
      {
        data: null,
        message: 'Error creating product',
      },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const stock = await stockRepository.create({ product_id: product.id, count });

  if (!stock) {
    return formatJSONResponse(
      {
        data: null,
        message: 'Error creating stock',
      },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return formatJSONResponse({
    data: { ...product, count },
    message: 'Product created',
  });
};

export const main = createProduct;

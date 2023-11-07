import { SQSEvent } from "aws-lambda";
import { ProductRepository, StockRepository } from "@repository";
import { formatJSONResponse } from "@libs/api-gateway";
import { publish } from "@libs/sns";

const catalogItemsQueueHandler = async (event: SQSEvent, context, callback) => {
  console.log(`[catalogItemsQueueHandler] ${JSON.stringify(event)}`);

  const productRepository = new ProductRepository();
  const stockRepository = new StockRepository();

  const results = [];

  for (const record of event.Records) {
    const { name: title = "", description = "", price = "", count = 0 } = JSON.parse(record.body);
    const product = await productRepository.create({ title, description, price });
    await stockRepository.create({ product_id: product.id, count });
    results.push({ ...product, count });
  }

  const message = {
    product_count: results.length,
    status: "Products created",
  };

  const snsArn = process.env.SNS_ARN;

  await publish(message, snsArn, {
    Subject: "Catalog Batch Process",
    MessageAttributes: {
      product_count: {
        DataType: "Number",
        StringValue: `${message.product_count}`,
      },
    },
  });

  return formatJSONResponse({ message: "File processed", products: results });
};

export const main = catalogItemsQueueHandler;

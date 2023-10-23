import { FromSchema } from 'json-schema-to-ts';

export const StockSchema = {
  type: 'object',
  properties: {
    product_id: { type: 'string' },
    count: { type: 'number' },
  },
  required: ['product_id', 'count'],
} as const;

export type StockType = FromSchema<typeof StockSchema>;

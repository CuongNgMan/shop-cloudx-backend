import { FromSchema } from 'json-schema-to-ts';

export const ProductSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
  },
  required: ['title', 'description', 'price'],
} as const;

export type ProductType = FromSchema<typeof ProductSchema>;

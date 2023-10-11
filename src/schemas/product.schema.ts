export const ProductSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'integer' },
  },
  required: ['name', 'description', 'price', 'count'],
} as const;

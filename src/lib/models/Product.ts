import mongoose from 'mongoose';

// add reviews schema later must
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sizes: [String],
    color: [String],
    price: {
      type: mongoose.Schema.Types.Decimal128,
      get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString()),
    },
    category: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    media: [String],
    tags: [String],
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
    ],
  },
  // cause we use get "getter function" in price
  { toJSON: { getters: true } }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;

import mongoose from "mongoose";

// add reviews schema later must
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
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
    stockQuantity: {
      type: Number,
      required: true,
      default: 0, // Set initial stock level
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
        ref: "Collection",
      },
    ],
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
  },
  // cause we use get "getter function" in price
  { toJSON: { getters: true }, timestamps: true }
);

ProductSchema.index({ title: 1 });
ProductSchema.index({ collections: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ review: 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;

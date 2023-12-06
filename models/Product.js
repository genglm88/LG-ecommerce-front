import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }],
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  productProperties:{type:Object},
}, {
  timestamps: true,
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;
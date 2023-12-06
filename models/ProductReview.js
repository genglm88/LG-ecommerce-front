import mongoose, { model, Schema, models } from "mongoose"
import Product from "./Product"

const ProductReviewSchema = new Schema(
  {
   reviewUser: { type: String, },
    product: { type: Schema.Types.ObjectId, ref: Product },
    numStars: { type: Number },
    title: { type: String },
    reviewContent: { type: String },
  },
  { timestamps: true }
)

const ProductReview =
  models?.ProductReview || model("ProductReview", ProductReviewSchema)

export default ProductReview

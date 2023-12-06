import mongoose, { model, Schema, models } from "mongoose"
import Product from "./Product"

const LikedProductSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: Product },
  },
  {
    timestamps: true,
  }
)

const LikedProduct =
  models?.LikedProduct || model("LikedProduct", LikedProductSchema)

export default LikedProduct

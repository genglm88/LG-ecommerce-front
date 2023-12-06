import { Schema, model, models } from "mongoose"

const OrderSchema = new Schema(
  {
    userEmail:String,
    line_items: Object,
    totalCost:Number,
    productImages: Object,
    productIds: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddr1: String,
    streetAddr2: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
)

const Order = models.Order || model("Order", OrderSchema)

export default Order

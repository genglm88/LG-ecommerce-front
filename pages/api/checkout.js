import mongooseConnect from "@/lib/mongoose"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { isRouteMatch } from "next/dist/server/future/route-matches/route-match"
import { authOptions } from "./auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { Setting } from "@/models/Setting"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export default async function handle(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.json("should be a POST or GET request")
    return
  }
  const session = await getServerSession(req, res, authOptions)
  if (req.method === "GET") {
    try {
      await mongooseConnect()
      const orderDoc = await Order.find({ userEmail: session?.user?.email })
      res.json(orderDoc)
    } catch (err) {
      console.error("Error connecting to monoDB.", err)
    }
  } else if (req.method === "POST") {
    try {
      await mongooseConnect()
      console.log("Connected to MongoDB checkout!!!")
      const {
        name,
        email,
        city,
        postalCode,
        streetAddr1,
        streetAddr2,
        country,
        cartProducts: products,
        totalCost,
      } = req.body
      const productsIds = products
      const uniqueIds = [...new Set(productsIds)]
      //console.log(uniqueIds)

      const productsInfos = await Product.find({ _id: uniqueIds })
      let line_items = []
      let productImages = []
      let productIds =[]
      for (const productId of uniqueIds) {
        const productInfo = productsInfos.find(
          (p) => p._id.toString() === productId
        )
        const quantity =
          productsIds.filter((id) => id === productId).length || 0
        if (quantity > 0) {
          line_items.push({
            quantity,
            price_data: {
              currency: "USD",
              product_data: { name: productInfo.title,},
              unit_amount: productInfo.price * 100,
            },
          })
          productImages.push(productInfo.images[0])
          productIds.push(productInfo._id.toString())
        }
      }

      const orderDoc = await Order.create({
        userEmail: session?.user?.email,
        line_items,
        totalCost,
        productImages,
        productIds,
        name,
        email,
        city,
        postalCode,
        streetAddr1,
        streetAddr2,
        country,
        paid: false,
      })

      const shippingFeeSetting = await Setting.findOne({name:'Shipping Fee'})
  
      const shippingFeeCents = Number(shippingFeeSetting.value || '0') * 100
      

      const stripSession = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: process.env.SUCCESS_URL + "/cart?success=1",
        cancel_url: process.env.SUCCESS_URL + "/cart?canceled=1",
        metadata: { orderId: orderDoc._id.toString() },
        allow_promotion_codes: true,

        shipping_options: [{
          shipping_rate_data:{
            display_name:'shipping fee',
            type:'fixed_amount',
            fixed_amount:{amount:shippingFeeCents, currency:"USD",}
          },
        }],
      })

      res.json({ url: stripSession.url })
    } catch (error) {
      console.error("Error connecting to MongoDB:", error)
    }
  }
}

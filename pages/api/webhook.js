import mongooseConnect from "@/lib/mongoose"
import Order from "@/models/Order"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import { buffer } from "micro"

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_99318e95b59132e0171a76632dd62681b64f68430515796c46ed8a6dc325a758"

const handler = async (req, res) => {
  try {
    await mongooseConnect()
    console.log("Connected to MongoDB! order")

    const sig = req.headers["stripe-signature"]

    let event

    try {
      event = stripe.webhooks.constructEvent(
        await buffer(req),
        sig,
        endpointSecret
      )
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const paymentIntentSucceeded = event.data.object
        // Then define and call a function to handle the event payment_intent.succeeded
        //console.log(paymentIntentSucceeded)
        const orderId = paymentIntentSucceeded.metadata.orderId
        const paid = paymentIntentSucceeded.payment_status === "paid"
        if (orderId && paid) {
          await Order.findByIdAndUpdate(orderId, {
            paid: true,
          })
        }
        break
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.status(200).send("ok")
  } catch (err) {
    console.error("Error connectiing to MongoDB")
  }
}

export default handler

export const config = {
  api: { bodyParser: false },
}

//gutsy-amuse-pretty-wow
//acct_1MKvteDPO1BaEHKc

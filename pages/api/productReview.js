import mongooseConnect from "@/lib/mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import ProductReview from "@/models/ProductReview"

const handle = async (req, res) => {
  try {
    await mongooseConnect()
    const { method } = req
    const session = await getServerSession(req, res, authOptions)

    if (method === "POST") {
      const { product, numStars, title, reviewContent } = req.body
      console.log(  product,
        numStars,
        title,
        reviewContent)
      res.json(
        await ProductReview.create({
         reviewUser: session?.user.email,
          product,
          numStars,
          title,
          reviewContent,
        })
      )
    } else if (method==='GET') {
        const {product}=req.query
        const reviewDoc = await ProductReview.find({product}, null, {sort:{createdAt:-1}})
        res.json(reviewDoc)
    }
  } catch (err) {
    console.error('Error connecting to Database.', err)
  }
}

export default handle

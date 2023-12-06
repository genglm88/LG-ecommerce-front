import mongooseConnect from "@/lib/mongoose"
import LikedProduct from "@/models/LikedProduct"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

const handle = async (req, res) => {
  try {
    await mongooseConnect()

    const { method } = req

    // get user ID
    const session = await getServerSession(req, res, authOptions)

    if (method === "POST") {
      const { product } = req.body

      const likedDoc = await LikedProduct.findOne({
        userEmail: session?.user.email,
        product,
      })
      if (likedDoc) {
        await LikedProduct.findOneAndDelete(likedDoc._id)
      } else {
        await LikedProduct.create({
          userEmail: session?.user.email,
          product,
        })
      }

      res.json(true)
    } else if (method === "GET") {
      try {
        const likedDoc = await LikedProduct.find(
          { userEmail: session?.user.email }).populate('product')
        res.json(likedDoc)
      } catch (error) {
        console.error("An error occurred:", error)
      }
    }
  } catch (err) {
    console.error("error with liked API ", err)
  }
}

export default handle

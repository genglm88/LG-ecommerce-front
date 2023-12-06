import mongooseConnect from "@/lib/mongoose"
import { authOptions } from "./auth/[...nextauth]"
import { getServerSession } from "next-auth"
import Address from "@/models/Address"

export default async function handler(req, res) {
  try {
    await mongooseConnect()

    const { method } = req

    const { name, email, city, postalCode, streetAddr1, streetAddr2, country } =
      req.body

    //get user ID
    const session  = await getServerSession(req, res, authOptions)

    const accountCreated = await Address.findOne({ userEmail: session?.user.email })

    if (method === "PUT") {
      if (accountCreated) {
        const AddressDoc = await Address.findByIdAndUpdate(accountCreated._id, {
          name,
          email,
          city,
          postalCode,
          streetAddr1,
          streetAddr2,
          country,
        })

        res.json(AddressDoc)
      } else {
        const AddressDoc = await Address.create({
          userEmail: session?.user.email,
          name,
          email,
          city,
          postalCode,
          streetAddr1,
          streetAddr2,
          country,
        })
        res.json(AddressDoc)
      }
    } else if (method === "GET") {
      const AddressDoc = await Address.findOne({ userEmail: session?.user.email })
      res.json(AddressDoc)
    }
  } catch (err) {
    console.error("error connecting to MonogoDB", err)
  }
}

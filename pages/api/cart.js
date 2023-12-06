import mongooseConnect from "@/lib/mongoose"
import Product from "@/models/Product"

// async function connectToDatabase() {
//   try {
//     await mongooseConnect();
//     console.log('Connected to MongoDB!');
//     // Your code here - perform database operations after successful connection.
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// }

export default async function handle(req, res) {
  try {
    await mongooseConnect()
    console.log("Connected to MongoDB! cart")
    const ids = req.body.ids
    res.json(await Product.find({ _id: ids }))
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
  }
}

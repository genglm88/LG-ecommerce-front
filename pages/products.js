import Center from "@/components/Center"
import Header from "@/components/Header"
import NewProducts from "@/components/NewProducts"
import mongooseConnect from "@/lib/mongoose"
import LikedProduct from "@/models/LikedProduct"
import Product from "@/models/Product"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"

export default function ProductsPage({ allProducts, allLikedProducts }) {
  //console.log(allLikedProducts)
  return (
    <div>
      <Header />
      <Center>
        <NewProducts
          newProducts={allProducts}
          allLikedProducts={allLikedProducts}
          displayTitle={"All Products"}
        />
      </Center>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  try {
    await mongooseConnect()
    const allProducts = await Product.find({}, null, { sort: { _id: -1 } })

    const allLikedProductsAll = await LikedProduct.find(
      { userEmail: session?.user.email, product: allProducts.map((p) => p._id) },
      null,
      { sort: { _id: -1 } }
    )
    const allLikedProducts = allLikedProductsAll.map((p) =>
      p.product.toString()
    )

    return {
      props: {
        allProducts: JSON.parse(JSON.stringify(allProducts)),
        allLikedProducts: JSON.parse(JSON.stringify(allLikedProducts)),
      },
    }
  } catch (err) {
    console.error("Cannot conect to MongoDB:", err)
  }
}

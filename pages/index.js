import Center from "@/components/Center"
import Featured from "@/components/Featured"
import Header from "@/components/Header"
import NewProducts from "@/components/NewProducts"
import mongooseConnect from "@/lib/mongoose"
import LikedProduct from "@/models/LikedProduct"
import Product from "@/models/Product"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import { Setting } from "@/models/Setting"

export default function HomePage({
  featuredProduct,
  newProducts,
  allLikedProducts,
}) {
  return (
    <div>
      <Header />
      <Center>
        <Featured featuredProduct={featuredProduct} />
        <NewProducts
          newProducts={newProducts}
          allLikedProducts={allLikedProducts}
          displayTitle="New Arrivals"
        />
      </Center>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  try {
    await mongooseConnect()
    const featuredProductIdSetting = await Setting.findOne({
      name: "Featured Product",
    })
    const featuredProductId = featuredProductIdSetting.value.toString()

    //const featuredProductId= '646c12dd253b7f3041d4ca3a'

    const featuredProduct = await Product.findById(featuredProductId)
    const newProducts = await Product.find({}, null, {
      sort: { _id: -1 },
      limit: 10,
    }) //assending
    const allLikedProductsAll = await LikedProduct.find(
      {
        userEmail: session?.user.email,
        product: newProducts.map((p) => p._id),
      },
      null,
      {
        sort: { _id: -1 },
      }
    )
    const allLikedProducts = allLikedProductsAll.map((pp) =>
      pp.product.toString()
    )
    console.log(allLikedProducts)
    return {
      props: {
        featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
        newProducts: JSON.parse(JSON.stringify(newProducts)),
        allLikedProducts: JSON.parse(JSON.stringify(allLikedProducts)),
      },
    }
  } catch (err) {
    console.error("Cannot conect to MongoDB:", err)
  }
}

import Center from "@/components/Center"
import Header from "@/components/Header"
import NewProducts, { Title } from "@/components/NewProducts"
import mongooseConnect from "@/lib/mongoose"
import { Category } from "@/models/Category"
import Product from "@/models/Product"
import { getServerSession } from "next-auth"
import React from "react"
import { authOptions } from "./api/auth/[...nextauth]"
import LikedProduct from "@/models/LikedProduct"

export default function CategoriesPage({
  catergoriesProducts,
  mainCategories,
  allLikedProducts,
}) {
  return (
    <>
      <Header />
      <Center>
        <Title>All Categories</Title>

        {mainCategories?.map((category) => {
          const { _id, categoryName } = category

          return (
            <NewProducts
              key={_id}
              newProducts={catergoriesProducts[_id]}
              allLikedProducts={allLikedProducts}
              displayTitle={categoryName}
              showAll={true}
              url={"/category/" + _id}
            />
          )
        })}
      </Center>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  try {
    await mongooseConnect()

    const allCategories = await Category.find({}, null, {
      sort: { _id: -1 },
    }).populate("parentCategory")

    const mainCategories = allCategories.filter(
      (cat) => cat.parentCategory === undefined
    )

    const catergoriesProducts = {} // key main cateory._id  [products]

    for (const cat of mainCategories) {
      const subId = allCategories
        .filter((cat1) => {
          return cat1?.parentCategory?._id.toString() === cat._id.toString()
        })
        .map((subcat) => subcat._id)

      catergoriesProducts[cat._id] = await Product.find(
        { categoryId: [cat._id, ...subId] },
        null,
        {}
      )
    }

    const allProducts = await Product.find({}, null)
    const allLikedProductsAll = await LikedProduct.find({
      userEmail: session?.user.email,
      product: allProducts.map((p) => p._id),
    })
    const allLikedProducts = allLikedProductsAll.map((p) =>
      p.product.toString()
    )
    return {
      props: {
        catergoriesProducts: JSON.parse(JSON.stringify(catergoriesProducts)),
        mainCategories: JSON.parse(JSON.stringify(mainCategories)),
        allLikedProducts: JSON.parse(JSON.stringify(allLikedProducts)),
      },
    }
  } catch (err) {
    console.error("Canoot connect to MongoDB", err)
  }
}

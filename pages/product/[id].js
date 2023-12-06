import Center from "@/components/Center"
import Header from "@/components/Header"
import NewProducts, { ProductsGrid, Title } from "@/components/NewProducts"
import ProductBox from "@/components/ProductBox"
import mongooseConnect from "@/lib/mongoose"
import Product from "@/models/Product"
import { getServerSession } from "next-auth"
import styled from "styled-components"
import { authOptions } from "../api/auth/[...nextauth]"
import LikedProduct from "@/models/LikedProduct"
import ProductReviews from "@/components/ProductReviews"

const ProductLayout = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 4fr;
  }
`

export default function ProductPage({ allProducts, allLikedProducts }) {
  return (
    <>
      <Header />
      <Center>
        <ProductLayout>
          <ProductsGrid>
            {allProducts?.length > 0 &&
              allProducts.map((product) => {
                const { _id } = product
                return (
                  <ProductBox
                    product={product}
                    liked={allLikedProducts.includes(_id)}
                    detail={true}
                    key={_id}
                  />
                )
              })}
          </ProductsGrid>
          <div>
            <Title>{allProducts[0].title}</Title>
            <p>{allProducts[0].description}</p>
          </div>
        </ProductLayout>
        <br/>
        <hr/>
        <ProductReviews product={allProducts} />
      </Center>
      
   
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  try {
    await mongooseConnect()
    console.log("Coonected to MongoDB!")
    const { id } = context.query
    //console.log(id)
    const products = await Product.findById(id)

    let allProducts = []
    allProducts.push(products)
    const allLikedProductsAll = await LikedProduct.find({
      userEmail: session?.user.email,
      product: allProducts.map((p) => p._id),
    })
    const allLikedProducts = allLikedProductsAll.map((p) =>
      p.product.toString()
    )
    //const allProducts = await Product.find({}, null, { sort: { _id: -1 } })
    //console.log(allLikedProducts)
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

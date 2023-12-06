import Center from "@/components/Center"
import Header from "@/components/Header"
import Spinner from "../../components/Spinner"
import NewProducts, {
  BoxTitle,
  ProductsGrid,
  Title,
} from "@/components/NewProducts"
import ProductBox from "@/components/ProductBox"

import mongooseConnect from "@/lib/mongoose"
import { Category } from "@/models/Category"
import Product from "@/models/Product"
import axios from "axios"
import { getServerSession } from "next-auth"
import { RevealWrapper } from "next-reveal"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { authOptions } from "../api/auth/[...nextauth]"
import LikedProduct from "@/models/LikedProduct"


const CatProp = styled.div`
  display: flex;
  gap: 20px;
  svg {
    max-height: 30px;
  }
  align-items: center;
  h2 {
    font-size: 2rem;
    font-weight: 700;
  }
  margin: 40px 0 20px 0;
  justify-content: space-between;
`
const SelDiv = styled.div`
  display: flex;
  gap: 10px;
  padding: 6px 12px;
  font-weight: bold;
  color: #444;
  align-items: center;
  background-color: #ddd;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 0px 0 5px 0;
  justify-content: space-between;
  select {
    background-color: transparent;
    border: 0;
    font-size: inherit;
  }
`

const LabelDiv = styled.div`
  display: flex;
  gap: 10px;
`
export default function CategoriesPage({
  displayCategory,
  subCategories,
  catergoriesProducts,
  allLikedProducts,
}) {
  const defaultSorting = "_id-asc"

  const { _id, categoryName, properties } = displayCategory[0]
  const defaultCatProperties = properties.map((prop) => ({
    name: prop.name,
    value: "All",
  }))
  const [catProperties, setCatProperties] = useState(defaultCatProperties)
  const [products, setProducts] = useState(catergoriesProducts[_id])
  const [sort, setSort] = useState(defaultSorting)
  const [loading, setLoading] = useState(false)
  const [filterChanged, setFilterChanged] = useState(false)

  useEffect(() => {
    const getProducts = async () => {
      const catIds = [_id, ...(subCategories.map((cat) => cat._id) || [])]

      try {
        let urlP = new URLSearchParams()
        urlP.set("sort", sort)
        urlP.set("categories", catIds.join(","))
        catProperties.forEach((catP) => {
          if (catP.value !== "All") {
            return urlP.set(catP.name, catP.value)
          }
        })

        const url = `/api/products?` + urlP.toString()
        //console.log(url)
        //let url = `/api/products?categories=${catIds.join(",")}`
        // catProperties.forEach(
        //   (catP) => (url += `&${catP.name}= ${catP.value}`)
        // )
        //catProperties.forEach(
        // (catP) => (url += "&" + catP.name + "=" + catP.value)
        // )
        const { data } = await axios.get(url)
        setLoading(false)
        setProducts(data)
      } catch (err) {
        console.error("Error with API get Products:", err)
      }
    }

    //if (catProperties === defaultCatProperties) return// if both are Alls, no need to reload. it doesn't work

    setLoading(true)
    getProducts()
  }, [catProperties, sort, filterChanged])

  return (
    <>
      <Header />
      <Center>
        <CatProp>
          <h2>{categoryName}</h2>
          <LabelDiv>
            {properties.map((prop, index) => {
              const { name, value } = prop
              const currentProp = catProperties?.find((p) => p.name === name)
              return (
                <SelDiv key={index}>
                  {name}
                  <select
                    value={currentProp?.value}
                    onChange={(e) => {
                      setFilterChanged(true)
                      setCatProperties((prev) => {
                        return prev.map((p) => ({
                          name: p.name,
                          value: p.name === name ? e.target.value : p.value,
                        }))
                      })
                    }}
                  >
                    <option value="All">All</option>
                    {prop.value.map((val, index) => (
                      <option key={index} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </SelDiv>
              )
            })}
            <SelDiv>
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setFilterChanged(true)
                  setSort(e.target.value)
                }}
              >
                <option value="price-asc">Price, lowest first</option>
                <option value="price-desc">Price, highest frist</option>
                <option value="_id-desc">newest first</option>
                <option value="_id-asc">oldest first</option>
              </select>
            </SelDiv>
          </LabelDiv>
        </CatProp>
        {loading ? (
          <Spinner fullWidth={true} />
        ) : products.length > 0 ? (
          <ProductsGrid>
            {products.map((product, index) => {
              return (
                <RevealWrapper key={index} delay={index * 60}>
                  <ProductBox
                    product={product}
                    liked={allLikedProducts.includes(product._id.toString())}
                  />
                </RevealWrapper>
              )
            })}
          </ProductsGrid>
        ) : (
          <Title>Sorry, no products found. </Title>
        )}
      </Center>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  try {
    await mongooseConnect()
    const { id } = context.query
    const allCategories = await Category.find({}, null, {
      sort: { _id: -1 },
    }).populate("parentCategory")

    const subCategories = allCategories?.filter(
      (cat) => cat.parentCategory?._id.toString() === id.toString()
    )
    //console.log(subCategories)
    //displayCategory = await Category.findById(id)
    //subCategoies= await Category.find({parentCateory:id})

    const displayCategory = allCategories?.filter(
      (cat) =>
        cat.parentCategory === undefined && cat._id.toString() === id.toString()
    )

    const catergoriesProducts = {} // key main cateory._id  [products]

    const subId = allCategories
      .filter((cat1) => {
        return cat1?.parentCategory?._id.toString() === id.toString()
      })
      .map((subcat) => subcat._id)

    catergoriesProducts[id] = await Product.find(
      { categoryId: [id, ...subId] },
      null,
      {}
    )
    const allLikedProductsAll = await LikedProduct.find(
      {
        userEmail: session?.user.email,
        product: catergoriesProducts[id].map((p) => p._id),
      },
      null,
      { sort: { _id: -1 } }
    )
    const allLikedProducts = allLikedProductsAll.map((p) =>
      p.product.toString()
    )
    return {
      props: {
        displayCategory: JSON.parse(JSON.stringify(displayCategory)),
        subCategories: JSON.parse(JSON.stringify(subCategories)),
        catergoriesProducts: JSON.parse(JSON.stringify(catergoriesProducts)),
        allLikedProducts: JSON.parse(JSON.stringify(allLikedProducts)),
      },
    }
  } catch (err) {
    console.error("Canoot connect to MongoDB", err)
  }
}

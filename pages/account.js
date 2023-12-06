import StyledButton from "@/components/ButtonStyle"
import Center from "@/components/Center"
import Header from "@/components/Header"
import NewProducts, { ProductsGrid, Title } from "@/components/NewProducts"
import { signIn, signOut, useSession } from "next-auth/react"
import { Box, CityPostCode, ColumnsWrapper } from "./cart"
import { RevealWrapper } from "next-reveal"
import InputPrimary from "@/components/InputPrimary"
import React, { useContext, useEffect, useState } from "react"
import { ButtonPrimary } from "@/components/PrimaryBtn"
import axios from "axios"
import Spinner from "@/components/Spinner"
import styled from "styled-components"
import ProductBox from "@/components/ProductBox"
import Tabs from "@/components/Tabs"
import ButtonLink from "@/components/ButtonLink"

const ButtonDiv = styled.div`
  width: 100%;
  margin-top: 10px;
`
const BoldSpan = styled.span`
  font-weight: bold;
`

const AccountColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.8fr 1fr;
  }
`

const OrderWrapper = styled.div`
margin-top: 10px;
font-size: 0.8rem;
border: 2px solid #eee;
border-radius: 10px;
display: flex;
flex-direction: column;
  }
`

const OrderTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 5px;
 background-color: #eee;
 padding: 10px;
 color:#222;

  }
`

const OrderItemsWrapper = styled.div`
  border-top: 2px solid #eee;
  display: flex;
  padding: 15px 5px;
`

const ItemDetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 15px;
`

const AccountProductImageBox = styled.td`
  width: 120px;
  height: 70px;
  padding: 15px;
  background-color: #iii;
  border-style: none;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    max-height: 100px;
    object-fit: cover;
    border-radius: 10px;
  }
`
const AccountPage = () => {
  const { data: session } = useSession()
  //const {data} = session

  const [likedProducts, setLikedProducts] = useState([])

  const logout = async () => {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    })
  }

  const login = async () => {
    await signIn("google")
  }

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    city: "",
    postalCode: "",
    streetAddr1: "",
    streetAddr2: "",
    country: "",
  })
  const { name, email, city, postalCode, streetAddr1, streetAddr2, country } =
    userInfo
  const [loading, setLoading] = useState(false)
  const [likedLoading, setLikedLoading] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState("Wishlist")
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const saveUerInfo = async () => {
    try {
      await axios.put("/api/address", userInfo)
    } catch (err) {
      console.error("Issue with API Save user Info", err)
    }
  }

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const { data } = await axios.get("/api/address")
        setLoading(false)
        if (data) {
          const { _id, userEmail, ...rest } = { data }
          //console.log(rest)
          setUserInfo(rest.data)
        }
      } catch (err) {
        console.error("error loading user info.", err)
      }
    }

    const loadlikedProducts = async () => {
      try {
        const { data } = await axios.get("/api/likedProduct")
        setLikedLoading(false)
        const data_ = data.map((p) => p.product)
        setLikedProducts(data_)
      } catch (err) {
        console.error("error with liked Products API", err)
      }
    }

    const loadOrders = async () => {
      try {
        const { data } = await axios.get("/api/checkout")
        setOrderLoading(false)
        setOrders(data)
        console.log(data)
      } catch (err) {
        console.error("Error connecting to MongoDB.", err)
      }
    }

    setLoading(true)
    loadUserInfo()
    setLikedLoading(true)
    loadlikedProducts()
    setOrderLoading(true)
    loadOrders()
  }, [session])

  const removeUnlikedProducts = (unlikedProductId) => {
    setLikedProducts((prev) =>
      prev.filter((p) => p._id.toString() !== unlikedProductId.toString())
    )
  }

  return (
    <>
      <Header />
      <Center>
        {!session && (
          <>
            <br />
            <br />
            <h2>Please sign in to add products to your wishlist.</h2>
            <br />
          </>
        )}
        {session && (
          <AccountColumnsWrapper>
            <RevealWrapper origin={"left"}>
              {likedLoading || orderLoading ? (
                <Spinner fullWidth={true} />
              ) : (
                <>
                  <Tabs
                    tabs={["Orders", "Wishlist"]}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />

                  {activeTab === "Wishlist" ? (
                    likedProducts?.length > 0 ? (
                      <ProductsGrid>
                        {likedProducts.map((product, index) => {
                          return (
                            <RevealWrapper key={index} delay={index * 50}>
                              <ProductBox
                                product={product}
                                key={product._id} //extreamly important ! key={index} doesn't work!
                                liked={true}
                                removeUnlikedProducts={removeUnlikedProducts}
                              />
                            </RevealWrapper>
                          )
                        })}
                      </ProductsGrid>
                    ) : (
                      <>
                        <br /> <h2>You wishlist is empty!</h2>
                      </>
                    )
                  ) : orders?.length > 0 ? (
                    <>
                      <BoldSpan>{orders.length} orders </BoldSpan> placed.
                      {orders?.map((order, index) => {
                        const {
                          line_items,
                          createdAt,
                          name,
                          totalCost,
                          productImages,
                          productIds,
                        } = order
                        return (
                          <OrderWrapper key={index}>
                            <OrderTitleWrapper>
                              <span>ORDER PLACED</span>
                              <span>TOTAL</span>
                              <span>SHIP TO</span>
                              <time>{(new Date(createdAt)).toLocaleString('sv-US')}</time>
                              <span>${totalCost}</span>
                              <span>{name}</span>
                            </OrderTitleWrapper>
                            {line_items.map((line, index) => {
                              const { quantity, price_data } = line
                              const url = '/product/' + productIds[index]
                              return (
                                <RevealWrapper key={index} delay={index * 50}>
                                  <OrderItemsWrapper>
                                    <AccountProductImageBox>
                                      <img src={productImages[index]} alt="" />
                                      {price_data.product_data.name}
                                    </AccountProductImageBox>
                                    <ItemDetailDiv>
                                      <div>
                                        ${price_data.unit_amount / 100} X{" "}
                                        {quantity} total: ${" "}
                                        {(quantity * price_data.unit_amount) /
                                          100}
                                      </div>
                                      <ButtonWrapper>
                                        <ButtonLink href={'/products/'} primary yellow outline>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                            />
                                          </svg>
                                          Buy it again
                                        </ButtonLink>
                                        <ButtonLink href={url} primary black outline>
                                          View your item
                                        </ButtonLink>
                                      </ButtonWrapper>
                                    </ItemDetailDiv>
                                  </OrderItemsWrapper>
                                </RevealWrapper>
                              )
                            })}
                          </OrderWrapper>
                        )
                      })}
                    </>
                  ) : (
                    <>
                      <br /> <h2>You dont have any order history.</h2>
                    </>
                  )}
                </>
              )}
            </RevealWrapper>
            <RevealWrapper origin={"right"}>
              {loading ? (
                <Spinner fullWidth={true} />
              ) : (
                <Box>
                  <h2>User information</h2>

                  <InputPrimary
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                  />
                  <InputPrimary
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                  <CityPostCode>
                    <InputPrimary
                      type="text"
                      placeholder="City"
                      name="city"
                      value={city}
                      onChange={handleChange}
                    />
                    <InputPrimary
                      type="text"
                      placeholder="Postal Code"
                      name="postalCode"
                      value={postalCode}
                      onChange={handleChange}
                    />
                  </CityPostCode>

                  <InputPrimary
                    type="text"
                    placeholder="Address"
                    name="streetAddr1"
                    value={streetAddr1}
                    onChange={handleChange}
                  />
                  <InputPrimary
                    type="text"
                    placeholder="Address 2"
                    name="streetAddr2"
                    value={streetAddr2}
                    onChange={handleChange}
                  />
                  <InputPrimary
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={country}
                    onChange={handleChange}
                  />
                  {/* <input
type="hidden"
name="products"
value={cartProducts.join(",")}
/> */}
                  <ButtonDiv>
                    <ButtonPrimary
                      size={"l"}
                      block
                      primary
                      onClick={saveUerInfo}
                    >
                      Save
                    </ButtonPrimary>
                    {session && (
                      <>
                        <hr />
                        <ButtonPrimary
                          size={"l"}
                          block
                          primary
                          onClick={logout}
                        >
                          Logout
                        </ButtonPrimary>
                      </>
                    )}
                  </ButtonDiv>
                </Box>
              )}
            </RevealWrapper>
          </AccountColumnsWrapper>
        )}

        {!session && (
          <>
            <StyledButton primary={1} onClick={login}>
              Login with Google
            </StyledButton>
          </>
        )}
      </Center>
    </>
  )
}

export default AccountPage

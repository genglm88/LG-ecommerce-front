import ButtonLink from "@/components/ButtonLink"
import { CartContext } from "@/components/CartContext"
import Center from "@/components/Center"
import Header from "@/components/Header"
import InputPrimary from "@/components/InputPrimary"
import { ButtonPrimary } from "@/components/PrimaryBtn"
import Table from "@/components/Table"
import axios from "axios"
import { RevealWrapper } from "next-reveal"
import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import Spinner from "@/components/Spinner"
import { useSession } from "next-auth/react"

export const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  table thead tr th,
  table tbody tr td {
    text-align: right;
    color: #222;
  }

  table thead tr th:nth-child(1),
  table tbody tr td:nth-child(1) {
    text-align: left;
  }

  table thead tr th:nth-child(2),
  table tbody tr td:nth-child(2) {
    text-align: center;
  }

  table tbody tr.total td:nth-child(2) {
    text-align: right;
  }

  table tr.itemtotal td {
    padding-top: 20px;
  }
  table tr.itemtotal td:nth-child(3) {
    font-weight: bold;
  }

  table tr.alltotal td:nth-child(2) {
    font-size: 1.2rem;
    font-weight: bold;
  }
`

export const Box = styled.div`
  background-color: #iii;
  border-radius: 10px;
  padding: 40px;
`

const ProductInfoCell = styled.td`
padding: 10px 0;
  }
`

const ProductImageBox = styled.td`
  width: 160px;
  height: 100px;
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

const CountLine = styled.td`
  ertical-align: center;
  display: flex;

  align-items: center;
  justify-content: center;
  margin-top: 60px;
`

const QuantityLabel = styled.span`
  padding: 0 3px;
`

const CartRow = styled.tr`
  vertical-align: center;
`
export const CityPostCode = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
`
const StyledP = styled.p`
  color: #333;
  font-size: 0.8rem;
`

const CartPage = ({}) => {
  const { data: session } = useSession()
  const {
    cartProducts,
    addProduct,
    removeProduct,
    numberOfProducts,
    clearCart,
  } = useContext(CartContext)
  const [products, setProducts] = useState([])
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    city: "",
    postalCode: "",
    streetAddr1: "",
    streetAddr2: "",
    country: "",
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shippingFee, setShippingFee] = useState(0)

  const { name, email, city, postalCode, streetAddr1, streetAddr2, country } =
    userInfo

  useEffect(() => {
    const getProductData = async () => {
      if (cartProducts.length > 0) {
        try {
          const { data } = await axios.post("/api/cart", { ids: cartProducts })
          setProducts(data)
        } catch (err) {
          console.error("Issues with api cart", err)
        }
      }
    }
    getProductData()
  }, [cartProducts])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.href.includes("success")) {
      setIsSuccess(true)
    }
    // preload user info
    const loadUserInfo = async () => {
      try {
        const { data } = await axios.get("/api/address")

        if (data) {
          const { _id, userEmail, ...rest } = { data }
          //console.log(rest)
          setUserInfo(rest.data)
          setLoading(false)
        }
      } catch (err) {
        console.error("error loading user info.", err)
      }
    }

    const loadShipping = async () => {
      const { data } = await axios.get("/api/settings?name=" + "Shipping Fee")

      setLoading(false)

      setShippingFee(data[0].value)
    }
    setLoading(true)
    loadUserInfo()
    setLoading(true)
    loadShipping()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const goToPayment = async () => {
    try {
      const { data } = await axios.post("/api/checkout", {
        name,
        email,
        city,
        postalCode: postalCode.toString(),
        streetAddr1,
        streetAddr2,
        country,
        cartProducts,
        totalCost: totalCost + Number(shippingFee),
      })
      if (data.url) {
        window.location = data.url
      }
    } catch (err) {
      console.error("error with the checkout API", err)
    }
  }

  let totalCost = 0
  if (isSuccess) {
    clearCart()
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>We will email you when your order is shipped.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    )
  }

  return (
    <div>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            {session && cartProducts.length > 0 ? (
              <>
                <h2>Cart</h2>
                <Table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product, index) => {
                      const itemNum = numberOfProducts(product._id)
                      const itemPrice = itemNum * product.price
                      totalCost += itemPrice

                      return (
                        <CartRow key={index}>
                          <ProductInfoCell>
                            <RevealWrapper delay={index * 100}>
                              <ProductImageBox>
                                <img src={product.images[0]} alt="" />
                                {product.title}
                              </ProductImageBox>
                            </RevealWrapper>
                          </ProductInfoCell>

                          <RevealWrapper delay={index * 100}>
                            <CountLine>
                              <ButtonPrimary
                                light
                                onClick={() => addProduct(product._id)}
                              >
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
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>
                              </ButtonPrimary>
                              <QuantityLabel>{itemNum}</QuantityLabel>

                              <ButtonPrimary
                                light
                                onClick={() => removeProduct(product._id)}
                              >
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
                                    d="M19.5 12h-15"
                                  />
                                </svg>
                              </ButtonPrimary>
                            </CountLine>
                          </RevealWrapper>

                          <td>
                            <RevealWrapper>${itemPrice}</RevealWrapper>
                          </td>
                        </CartRow>
                      )
                    })}

                    <tr className="itemtotal">
                      <td>
                        <span>Item total</span>
                      </td>
                      <td>{cartProducts.length}</td>
                      <td>${totalCost}</td>
                    </tr>
                    <tr className="total">
                      <td colSpan={2}>Shipping:</td>
                      <td>${shippingFee}</td>
                    </tr>
                    <tr className="total alltotal">
                      <td colSpan={2}>
                        <h2>Total:</h2>
                      </td>
                      <td>${totalCost + Number(shippingFee)}</td>
                    </tr>
                  </tbody>
                </Table>
                <StyledP>Coupon codes can be applied on the payment page.</StyledP>
              </>
            ) : (
              session && <div>Your Cart is empty.</div>
            )}
          </Box>

          {session &&
            cartProducts.length > 0 &&
            (loading ? (
              <Spinner fullWidth={true} />
            ) : (
              <RevealWrapper origin={"right"}>
                <Box>
                  <h2>Order information</h2>

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
                  <ButtonPrimary size={"l"} block primary onClick={goToPayment}>
                    Continue to payment
                  </ButtonPrimary>
                </Box>
              </RevealWrapper>
            ))}
        </ColumnsWrapper>
      </Center>
    </div>
  )
}

export default CartPage

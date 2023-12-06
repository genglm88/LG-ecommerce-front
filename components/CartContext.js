import { createContext, useEffect, useState } from "react"

export const CartContext = createContext({})

export const CartContextProvider = ({ children }) => {
  const ls = typeof window !== "undefined" ? window.localStorage : null

  const [cartProducts, setCartProducts] = useState([])

  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem("cart", JSON.stringify(cartProducts))
    }
  }, [cartProducts])

  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      setCartProducts(JSON.parse(ls.getItem("cart")))
    }
  }, [])

  const addProduct = (productId) => {
    setCartProducts((prev) => [...prev, productId])
  }

  const numberOfProducts = (productId) => {
    return cartProducts.filter((product) => product=== productId).length
  }

  const removeProduct = (productId) => {
    if (numberOfProducts(productId) > 0) {
      setCartProducts((prev) => {
        const productIdIndex = prev.indexOf(productId)
         return prev.filter((product, index) => (index !== productIdIndex))
      })
    }
  }

  const clearCart = () =>{
    setCartProducts([])
    ls?.setItem("cart", JSON.stringify(cartProducts))
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        numberOfProducts,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
